import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getBooksData, type CMUBook } from "./dataLoader";
import { getRecommendations } from "./mlRecommender";
import { fetchBookCovers } from "./googleBooksService";
import { ensureInitialized } from "./lazyInit";
import { setupAuth, isAuthenticated } from "./replitAuth";

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
  await setupAuth(app);

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get("/api/user/books", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const status = req.query.status as string | undefined;
      
      let books;
      if (status) {
        books = await storage.getUserBooksByStatus(userId, status);
      } else {
        books = await storage.getUserBooks(userId);
      }
      res.json({ books });
    } catch (error) {
      console.error("Error fetching user books:", error);
      res.status(500).json({ error: "Failed to fetch user books" });
    }
  });

  app.post("/api/user/books", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { bookId, title, authors, coverUrl, description, status } = req.body;
      
      if (!bookId || !title || !status) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      if (!['want_to_read', 'have_read'].includes(status)) {
        return res.status(400).json({ error: "Invalid status. Must be 'want_to_read' or 'have_read'" });
      }
      
      const book = await storage.addUserBook({
        userId,
        bookId,
        title,
        authors: Array.isArray(authors) ? authors.join(', ') : authors,
        coverUrl,
        description,
        status,
      });
      
      res.json({ book });
    } catch (error) {
      console.error("Error saving book:", error);
      res.status(500).json({ error: "Failed to save book" });
    }
  });

  app.delete("/api/user/books/:bookId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { bookId } = req.params;
      
      await storage.removeUserBook(userId, bookId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing book:", error);
      res.status(500).json({ error: "Failed to remove book" });
    }
  });

  app.patch("/api/user/books/:bookId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { bookId } = req.params;
      const { status } = req.body;
      
      if (!['want_to_read', 'have_read'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      const book = await storage.updateUserBookStatus(userId, bookId, status);
      res.json({ book });
    } catch (error) {
      console.error("Error updating book:", error);
      res.status(500).json({ error: "Failed to update book" });
    }
  });

  app.get("/api/user/books/:bookId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { bookId } = req.params;
      
      const book = await storage.getUserBook(userId, bookId);
      res.json({ book: book || null });
    } catch (error) {
      console.error("Error fetching book:", error);
      res.status(500).json({ error: "Failed to fetch book" });
    }
  });

  app.get("/api/books/recommend", async (req, res) => {
    try {
      await ensureInitialized();
      
      const mood = (req.query.mood as string) || '';
      const limit = parseInt(req.query.limit as string) || 10;
      
      if (!mood) {
        return res.status(400).json({ error: "Mood parameter is required" });
      }

      const recommendedBooks = getRecommendations(mood, limit);
      
      if (recommendedBooks.length === 0) {
        return res.json({ books: [] });
      }

      const coverMap = await fetchBookCovers(
        recommendedBooks.map(book => ({ title: book.title, author: book.author }))
      );
      
      recommendedBooks.forEach(book => {
        const key = `${book.title}|||${book.author}`;
        book.coverImage = coverMap.get(key);
      });

      const booksWithCovers = recommendedBooks.filter(book => book.coverImage);
      const books: Book[] = booksWithCovers.map(book => convertCMUBookToBook(book));

      return res.json({ books });
    } catch (error) {
      console.error("Error recommending books:", error);
      return res.status(500).json({ error: "Failed to recommend books" });
    }
  });

  app.get("/api/books/popular", async (req, res) => {
    try {
      await ensureInitialized();
      
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
      
      const coverMap = await fetchBookCovers(
        randomBooks.map(book => ({ title: book.title, author: book.author }))
      );
      
      randomBooks.forEach(book => {
        const key = `${book.title}|||${book.author}`;
        book.coverImage = coverMap.get(key);
      });
      
      const booksWithCovers = randomBooks.filter(book => book.coverImage);
      const books: Book[] = booksWithCovers.map(book => convertCMUBookToBook(book));

      return res.json({ books });
    } catch (error) {
      console.error("Error fetching popular books:", error);
      return res.status(500).json({ error: "Failed to fetch popular books" });
    }
  });

  return createServer(app);
}
