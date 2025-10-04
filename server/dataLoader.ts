import fs from 'fs';
import { parse } from 'csv-parse';

export interface CMUBook {
  wikipediaId: string;
  freebaseId: string;
  title: string;
  author: string;
  publicationDate: string;
  genres: Record<string, string>;
  summary: string;
}

let booksData: CMUBook[] = [];

export async function loadBooksData(): Promise<void> {
  return new Promise((resolve, reject) => {
    const books: CMUBook[] = [];
    
    fs.createReadStream('booksummaries/booksummaries.txt')
      .pipe(parse({
        delimiter: '\t',
        columns: false,
        skip_empty_lines: true
      }))
      .on('data', (row: string[]) => {
        try {
          const [wikipediaId, freebaseId, title, author, publicationDate, genresJson, summary] = row;
          
          let genres: Record<string, string> = {};
          try {
            genres = JSON.parse(genresJson || '{}');
          } catch (e) {
            genres = {};
          }
          
          books.push({
            wikipediaId,
            freebaseId,
            title,
            author,
            publicationDate,
            genres,
            summary
          });
        } catch (error) {
          console.error('Error parsing row:', error);
        }
      })
      .on('end', () => {
        booksData = books;
        console.log(`Loaded ${booksData.length} books from CMU dataset`);
        resolve();
      })
      .on('error', (error) => {
        console.error('Error loading books data:', error);
        reject(error);
      });
  });
}

export function getBooksData(): CMUBook[] {
  return booksData;
}

export function searchBooks(query: string, limit: number = 40): CMUBook[] {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/);
  
  const scoredBooks = booksData.map(book => {
    let score = 0;
    const titleLower = book.title.toLowerCase();
    const authorLower = book.author.toLowerCase();
    const summaryLower = book.summary.toLowerCase();
    const genreValues = Object.values(book.genres).map(g => g.toLowerCase());
    
    queryWords.forEach(word => {
      if (titleLower.includes(word)) score += 10;
      if (authorLower.includes(word)) score += 8;
      
      genreValues.forEach(genre => {
        if (genre.includes(word)) score += 20;
      });
      
      if (summaryLower.includes(word)) score += 3;
    });
    
    return { book, score };
  })
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, limit);
  
  return scoredBooks.map(item => item.book);
}

export function getBooksByGenre(genre: string, limit: number = 40): CMUBook[] {
  const genreLower = genre.toLowerCase();
  
  const matchingBooks = booksData.filter(book => {
    const genreValues = Object.values(book.genres).map(g => g.toLowerCase());
    return genreValues.some(g => g.includes(genreLower));
  });
  
  return matchingBooks.slice(0, limit);
}
