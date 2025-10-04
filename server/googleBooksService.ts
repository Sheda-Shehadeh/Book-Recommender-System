interface GoogleBooksVolume {
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      smallThumbnail?: string;
      thumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
      extraLarge?: string;
    };
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
  };
}

interface GoogleBooksResponse {
  items?: GoogleBooksVolume[];
}

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

export async function fetchBookCover(title: string, author: string): Promise<string | null> {
  try {
    const query = `intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(author)}`;
    const url = `${GOOGLE_BOOKS_API}?q=${query}&maxResults=1`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn(`Google Books API error: ${response.status} for "${title}" by ${author}`);
      return null;
    }
    
    const data: GoogleBooksResponse = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return null;
    }
    
    const imageLinks = data.items[0].volumeInfo.imageLinks;
    if (!imageLinks) {
      return null;
    }
    
    // Prefer larger images, fall back to smaller ones
    const coverUrl = imageLinks.large || 
                     imageLinks.medium || 
                     imageLinks.small ||
                     imageLinks.thumbnail ||
                     imageLinks.smallThumbnail;
    
    // Upgrade to HTTPS if needed
    return coverUrl ? coverUrl.replace('http://', 'https://') : null;
  } catch (error) {
    console.error(`Error fetching cover for "${title}":`, error);
    return null;
  }
}

export async function fetchBookCovers(books: Array<{ title: string; author: string }>): Promise<Map<string, string>> {
  const coverMap = new Map<string, string>();
  
  // Fetch covers with rate limiting (max 10 concurrent requests)
  const batchSize = 10;
  for (let i = 0; i < books.length; i += batchSize) {
    const batch = books.slice(i, i + batchSize);
    const promises = batch.map(async (book) => {
      const cover = await fetchBookCover(book.title, book.author);
      if (cover) {
        const key = `${book.title}|||${book.author}`;
        coverMap.set(key, cover);
      }
    });
    
    await Promise.all(promises);
    
    // Small delay between batches to avoid rate limiting
    if (i + batchSize < books.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return coverMap;
}
