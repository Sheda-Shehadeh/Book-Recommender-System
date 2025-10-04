import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getBooksData, type CMUBook } from "./dataLoader";
import { getRecommendations } from "./mlRecommender";
import { fetchBookCovers } from "./googleBooksService";

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
  horror: ['horror', 'supernatural', 'gothic'],
  romance: ['romance', 'love story', 'romantic'],
  'young adult': ['young adult fiction', 'juvenile fiction', 'children'],
  thriller: ['thriller', 'suspense'],
  drama: ['drama', 'literary fiction'],
  adventure: ['adventure', 'action'],
  historical: ['historical fiction', 'history'],
  comedy: ['humor', 'comedy', 'satire'],
  inspirational: ['inspirational', 'self-help'],
};

function convertCMUBookToBook(cmuBook: CMUBook): Book {
  return {
    id: cmuBook.wikipediaId,
    title: cmuBook.title,
    authors: cmuBook.author ? [cmuBook.author] : ['Unknown Author'],
    description: cmuBook.summary.slice(0, 500),
    categories: Object.values(cmuBook.genres),
    coverUrl: cmuBook.coverImage || '',
    publishedDate: cmuBook.publicationDate,
  };
}

function calculateRelevanceScore(cmuBook: CMUBook, moodQuery: string): number {
  let score = 0;
  const query = moodQuery.toLowerCase();
  const queryWords = query.split(/\s+/);
  
  const title = cmuBook.title.toLowerCase();
  const summary = cmuBook.summary.toLowerCase();
  const genreValues = Object.values(cmuBook.genres).map(g => g.toLowerCase());
  
  if (genreValues.length === 0) {
    return 0;
  }
  
  queryWords.forEach((word: string) => {
    genreValues.forEach(genre => {
      if (genre.includes(word)) {
        score += 25;
      }
    });
    
    const relatedGenres = moodToGenreMap[word] || [];
    relatedGenres.forEach(relatedGenre => {
      genreValues.forEach(genre => {
        if (genre.includes(relatedGenre.toLowerCase())) {
          score += 20;
        }
      });
      
      if (summary.includes(relatedGenre.toLowerCase())) {
        score += 8;
      }
    });
    
    if (title.includes(word) && word.length > 3) {
      score += 5;
    }
    
    if (summary.includes(word) && word.length > 3) {
      score += 3;
    }
  });
  
  return score;
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/books/recommend", async (req, res) => {
    try {
      const mood = (req.query.mood as string) || '';
      const limit = parseInt(req.query.limit as string) || 10;
      
      if (!mood) {
        return res.status(400).json({ error: "Mood parameter is required" });
      }

      const recommendedBooks = getRecommendations(mood, limit);
      
      if (recommendedBooks.length === 0) {
        return res.json({ books: [] });
      }

      // Fetch cover images from Google Books
      const coverMap = await fetchBookCovers(
        recommendedBooks.map(book => ({ title: book.title, author: book.author }))
      );
      
      // Add cover images to books
      recommendedBooks.forEach(book => {
        const key = `${book.title}|||${book.author}`;
        book.coverImage = coverMap.get(key);
      });

      const books: Book[] = recommendedBooks.map(book => convertCMUBookToBook(book));

      return res.json({ books });
    } catch (error) {
      console.error("Error recommending books:", error);
      return res.status(500).json({ error: "Failed to recommend books" });
    }
  });

  app.get("/api/books/popular", async (req, res) => {
    try {
      const allBooks = getBooksData();
      
      if (allBooks.length === 0) {
        return res.json({ books: [] });
      }

      const popularGenres = ['fiction', 'novel', 'literature'];
      
      const filteredBooks = allBooks.filter(book => {
        const genreValues = Object.values(book.genres).map(g => g.toLowerCase());
        return popularGenres.some(pg => genreValues.some(gv => gv.includes(pg)));
      });

      const randomBooks = filteredBooks
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);
      
      // Fetch cover images from Google Books
      const coverMap = await fetchBookCovers(
        randomBooks.map(book => ({ title: book.title, author: book.author }))
      );
      
      // Add cover images to books
      randomBooks.forEach(book => {
        const key = `${book.title}|||${book.author}`;
        book.coverImage = coverMap.get(key);
      });
      
      const books: Book[] = randomBooks.map(book => convertCMUBookToBook(book));

      return res.json({ books });
    } catch (error) {
      console.error("Error fetching popular books:", error);
      return res.status(500).json({ error: "Failed to fetch popular books" });
    }
  });

  return createServer(app);
}
