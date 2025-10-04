import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

interface Book {
  id: string;
  title: string;
  authors: string[];
  description: string;
  categories: string[];
  coverUrl: string;
  publishedDate: string;
  averageRating?: number;
}

const moodToGenreMap: Record<string, string[]> = {
  mystery: ['mystery', 'detective', 'crime', 'thriller'],
  fantasy: ['fantasy', 'magic', 'epic fantasy', 'sword and sorcery'],
  'sci-fi': ['science fiction', 'dystopian', 'space opera', 'cyberpunk'],
  'science fiction': ['science fiction', 'dystopian', 'space opera', 'cyberpunk'],
  horror: ['horror', 'supernatural', 'gothic', 'paranormal'],
  romance: ['romance', 'love story', 'contemporary romance', 'romantic comedy'],
  'young adult': ['young adult', 'teen', 'coming of age', 'ya fiction'],
  thriller: ['thriller', 'suspense', 'psychological thriller', 'action'],
  drama: ['drama', 'literary fiction', 'contemporary fiction'],
  adventure: ['adventure', 'action adventure', 'quest'],
  historical: ['historical fiction', 'historical', 'period drama'],
  comedy: ['humor', 'comedy', 'satire', 'funny'],
  inspirational: ['inspirational', 'motivational', 'uplifting', 'self-help'],
};

function calculateRelevanceScore(book: any, moodQuery: string): number {
  let score = 0;
  const query = moodQuery.toLowerCase();
  const queryWords = query.split(/\s+/);
  
  const volumeInfo = book.volumeInfo || {};
  const categories = volumeInfo.categories || [];
  const description = (volumeInfo.description || '').toLowerCase();
  const title = (volumeInfo.title || '').toLowerCase();
  
  queryWords.forEach((word: string) => {
    if (categories.some((cat: string) => cat.toLowerCase().includes(word))) {
      score += 10;
    }
    
    if (description.includes(word)) {
      score += 5;
    }
    
    if (title.includes(word)) {
      score += 3;
    }
    
    const relatedGenres = moodToGenreMap[word] || [];
    relatedGenres.forEach(genre => {
      if (categories.some((cat: string) => cat.toLowerCase().includes(genre))) {
        score += 7;
      }
    });
  });
  
  if (volumeInfo.averageRating) {
    score += volumeInfo.averageRating * 2;
  }
  
  return score;
}

async function searchGoogleBooks(query: string, maxResults: number = 40): Promise<any> {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}&printType=books&orderBy=relevance`;
  const response = await fetch(url);
  return response.json();
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/book-cover/:isbn", async (req, res) => {
    try {
      const { isbn } = req.params;
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      const data = await response.json();
      
      if (data.items && data.items[0]?.volumeInfo?.imageLinks) {
        const imageLinks = data.items[0].volumeInfo.imageLinks;
        const coverUrl = imageLinks.large || imageLinks.medium || imageLinks.thumbnail || imageLinks.smallThumbnail;
        
        if (coverUrl) {
          const httpsUrl = coverUrl.replace('http://', 'https://');
          return res.json({ coverUrl: httpsUrl });
        }
      }
      
      return res.status(404).json({ error: "Cover not found" });
    } catch (error) {
      console.error("Error fetching book cover:", error);
      return res.status(500).json({ error: "Failed to fetch book cover" });
    }
  });

  app.get("/api/books/recommend", async (req, res) => {
    try {
      const mood = (req.query.mood as string) || '';
      const limit = parseInt(req.query.limit as string) || 10;
      const randomSeed = parseInt(req.query.seed as string) || Date.now();
      
      if (!mood) {
        return res.status(400).json({ error: "Mood parameter is required" });
      }

      const moodLower = mood.toLowerCase();
      const queryWords = moodLower.split(/\s+/);
      let searchQuery = '';
      let isYoungAdult = false;
      
      if (moodLower.includes('young adult') || moodLower.includes('ya') || moodLower.includes('teen')) {
        searchQuery = 'subject:"young adult fiction"';
        isYoungAdult = true;
      } else {
        const expandedQueries: string[] = [];
        queryWords.forEach(word => {
          const relatedGenres = moodToGenreMap[word] || [];
          if (relatedGenres.length > 0) {
            const randomIndex = Math.floor((randomSeed + word.charCodeAt(0)) % relatedGenres.length);
            expandedQueries.push(`subject:${relatedGenres[randomIndex]}`);
          }
        });
        
        if (expandedQueries.length === 0) {
          expandedQueries.push(mood);
        }
        searchQuery = expandedQueries.join(' ');
      }

      const startIndex = Math.floor((randomSeed % 50)) * 10;
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=40&printType=books&orderBy=relevance&startIndex=${startIndex}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        return res.json({ books: [] });
      }

      let booksToScore = data.items;
      
      if (isYoungAdult) {
        const yaBooks = data.items.filter((item: any) => {
          const categories = (item.volumeInfo?.categories || []).map((c: string) => c.toLowerCase());
          const description = (item.volumeInfo?.description || '').toLowerCase();
          return categories.some((cat: string) => 
            cat.includes('young adult') || 
            cat.includes('juvenile fiction') || 
            cat.includes('teen')
          ) || description.includes('young adult') || description.includes('teen');
        });
        
        if (yaBooks.length >= 5) {
          booksToScore = yaBooks;
        }
      }

      const booksWithCovers = booksToScore.filter((item: any) => item.volumeInfo?.imageLinks);
      
      const uniqueBooks = new Map();
      const scoredBooks = booksWithCovers
        .map((item: any) => ({
          item,
          score: calculateRelevanceScore(item, mood) + (Math.random() * 10)
        }))
        .sort((a: any, b: any) => b.score - a.score)
        .filter((scored: any) => {
          if (uniqueBooks.has(scored.item.id)) {
            return false;
          }
          uniqueBooks.set(scored.item.id, true);
          return true;
        })
        .slice(0, limit);

      const books: Book[] = scoredBooks
        .map(({ item }: any) => {
          const vol = item.volumeInfo;
          const imageLinks = vol.imageLinks || {};
          const coverUrl = (imageLinks.large || imageLinks.medium || imageLinks.thumbnail || imageLinks.smallThumbnail || '').replace('http://', 'https://');
          
          return {
            id: item.id,
            title: vol.title || 'Unknown Title',
            authors: vol.authors || ['Unknown Author'],
            description: vol.description || 'No description available',
            categories: vol.categories || [],
            coverUrl,
            publishedDate: vol.publishedDate || '',
            averageRating: vol.averageRating
          };
        });

      return res.json({ books });
    } catch (error) {
      console.error("Error recommending books:", error);
      return res.status(500).json({ error: "Failed to recommend books" });
    }
  });

  app.get("/api/books/popular", async (req, res) => {
    try {
      const categories = ['fiction', 'mystery', 'romance', 'science fiction', 'fantasy'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      const data = await searchGoogleBooks(`subject:${randomCategory}`, 20);
      
      if (!data.items || data.items.length === 0) {
        return res.json({ books: [] });
      }

      const books: Book[] = data.items
        .filter((item: any) => item.volumeInfo?.imageLinks)
        .slice(0, 10)
        .map((item: any) => {
          const vol = item.volumeInfo;
          const imageLinks = vol.imageLinks || {};
          const coverUrl = (imageLinks.large || imageLinks.medium || imageLinks.thumbnail || imageLinks.smallThumbnail || '').replace('http://', 'https://');
          
          return {
            id: item.id,
            title: vol.title || 'Unknown Title',
            authors: vol.authors || ['Unknown Author'],
            description: vol.description || 'No description available',
            categories: vol.categories || [],
            coverUrl,
            publishedDate: vol.publishedDate || '',
            averageRating: vol.averageRating
          };
        });

      return res.json({ books });
    } catch (error) {
      console.error("Error fetching popular books:", error);
      return res.status(500).json({ error: "Failed to fetch popular books" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
