import natural from 'natural';
// @ts-ignore - no type definitions available
import { removeStopwords } from 'stopword';
import type { CMUBook } from './dataLoader';

const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();

interface BookWithVector {
  book: CMUBook;
  documentIndex: number;
}

let tfidf: any = null;
let booksWithVectors: BookWithVector[] = [];

export function trainModel(books: CMUBook[]): void {
  console.log('Training TF-IDF model on book summaries...');
  
  tfidf = new TfIdf();
  booksWithVectors = [];
  
  books.forEach((book, index) => {
    const genres = Object.values(book.genres).join(' ');
    const text = `${book.title} ${genres} ${book.summary}`;
    
    const tokens = tokenizer.tokenize(text.toLowerCase());
    const filteredTokens = removeStopwords(tokens || []);
    const processedText = filteredTokens.join(' ');
    
    tfidf.addDocument(processedText);
    booksWithVectors.push({ book, documentIndex: index });
  });
  
  console.log(`Model trained on ${booksWithVectors.length} books`);
}

export function getRecommendations(query: string, limit: number = 10): CMUBook[] {
  if (!tfidf || booksWithVectors.length === 0) {
    console.warn('Model not trained yet');
    return [];
  }
  
  const queryTokens = tokenizer.tokenize(query.toLowerCase());
  const filteredQuery = removeStopwords(queryTokens || []).join(' ');
  
  console.log(`\nSearching for: "${query}" (processed: "${filteredQuery}")`);
  
  const scores: { book: CMUBook; score: number }[] = [];
  
  tfidf.tfidfs(filteredQuery, (docIndex: number, measure: number) => {
    if (measure > 0 && booksWithVectors[docIndex]) {
      const book = booksWithVectors[docIndex].book;
      let finalScore = measure;
      
      // Check if query matches any genre
      const bookGenres = Object.values(book.genres).map(g => g.toLowerCase());
      const queryLower = query.toLowerCase();
      
      if (bookGenres.some(genre => 
        genre.includes(queryLower) || queryLower.includes(genre)
      )) {
        // Massively boost score if genre matches
        finalScore *= 100;
      }
      
      scores.push({
        book: book,
        score: finalScore
      });
    }
  });
  
  console.log(`Found ${scores.length} books with scores > 0`);
  
  const shuffled = scores
    .map(item => ({
      ...item,
      finalScore: item.score * (0.2 + Math.random() * 1.8)
    }))
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, limit);
  
  shuffled.sort(() => Math.random() - 0.5);
  
  console.log(`Top ${shuffled.length} books:`);
  shuffled.slice(0, 3).forEach(item => {
    const genres = Object.values(item.book.genres).join(', ');
    console.log(`  - "${item.book.title}" | Genres: [${genres}]`);
  });
  
  return shuffled.map(item => item.book);
}

export function isModelTrained(): boolean {
  return tfidf !== null && booksWithVectors.length > 0;
}
