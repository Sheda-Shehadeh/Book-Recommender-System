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
  mystery: ['mystery', 'detective', 'crime'],
  fantasy: ['fantasy', 'epic fantasy'],
  'sci-fi': ['science fiction', 'dystopian'],
  'science fiction': ['science fiction', 'dystopian'],
  horror: ['horror', 'supernatural'],
  romance: ['romance', 'love story'],
  'young adult': ['young adult fiction', 'juvenile fiction'],
  thriller: ['thriller', 'suspense'],
  drama: ['drama', 'literary fiction'],
  adventure: ['adventure', 'action'],
  historical: ['historical fiction'],
  comedy: ['humor', 'comedy'],
  inspirational: ['inspirational', 'self-help'],
};

const fictionCategories = [
  'fiction',
  'romance',
  'mystery',
  'thriller',
  'fantasy',
  'science fiction',
  'horror',
  'adventure',
  'young adult fiction',
  'juvenile fiction',
  'historical fiction',
  'drama',
  'humor',
  'poetry',
  'comics'
];

function calculateRelevanceScore(book: any, moodQuery: string): number {
  let score = 0;
  const query = moodQuery.toLowerCase();
  const queryWords = query.split(/\s+/);
  
  const volumeInfo = book.volumeInfo || {};
  const categories = (volumeInfo.categories || []).map((c: string) => c.toLowerCase());
  
  if (categories.length === 0) {
    return 0;
  }
  
  const hasFictionCategory = categories.some((cat: string) => 
    fictionCategories.some(fc => cat.includes(fc.toLowerCase()))
  );
  
  if (!hasFictionCategory) {
    return 0;
  }
  
  let hasGenreMatch = false;
  
  queryWords.forEach((word: string) => {
    if (categories.some((cat: string) => cat.includes(word))) {
      score += 20;
      hasGenreMatch = true;
    }
    
    const relatedGenres = moodToGenreMap[word] || [];
    relatedGenres.forEach(genre => {
      if (categories.some((cat: string) => cat.includes(genre.toLowerCase()))) {
        score += 15;
        hasGenreMatch = true;
      }
    });
  });
  
  if (!hasGenreMatch) {
    return 0;
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
      
      let searchQueries: string[] = [];
      queryWords.forEach(word => {
        const relatedGenres = moodToGenreMap[word] || [];
        if (relatedGenres.length > 0) {
          const randomIndex = Math.floor((randomSeed + word.charCodeAt(0)) % relatedGenres.length);
          const selectedGenre = relatedGenres[randomIndex];
          searchQueries.push(`subject:"${selectedGenre}"`);
        } else {
          searchQueries.push(`subject:"${word}"`);
        }
      });
      
      if (searchQueries.length === 0) {
        searchQueries.push(mood);
      }

      const searchQuery = searchQueries.join(' ');
      const startIndex = (randomSeed % 100) * 4;
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=40&printType=books&orderBy=relevance&startIndex=${startIndex}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        const fallbackUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(mood)}&maxResults=40&printType=books&orderBy=relevance`;
        const fallbackResponse = await fetch(fallbackUrl);
        const fallbackData = await fallbackResponse.json();
        
        if (!fallbackData.items || fallbackData.items.length === 0) {
          return res.json({ books: [] });
        }
        
        data.items = fallbackData.items;
      }

      const booksToScore = data.items.filter((item: any) => item.volumeInfo?.categories);

      const uniqueBooks = new Map();
      const scoredBooks = booksToScore
        .map((item: any) => {
          const baseScore = calculateRelevanceScore(item, mood);
          
          if (baseScore === 0) {
            return {
              item,
              score: 0
            };
          }
          
          const ratingBonus = (item.volumeInfo?.averageRating || 0) * 5;
          const randomFactor = Math.random() * 8;
          const totalScore = baseScore + ratingBonus + randomFactor;
          
          return {
            item,
            score: totalScore
          };
        })
        .filter((scored: any) => scored.score > 0)
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
