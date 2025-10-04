import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

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

  const httpServer = createServer(app);

  return httpServer;
}
