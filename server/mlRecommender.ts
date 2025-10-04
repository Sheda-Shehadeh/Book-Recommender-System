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
  
  const scores: { book: CMUBook; score: number }[] = [];
  
  tfidf.tfidfs(filteredQuery, (docIndex: number, measure: number) => {
    if (measure > 0 && booksWithVectors[docIndex]) {
      scores.push({
        book: booksWithVectors[docIndex].book,
        score: measure
      });
    }
  });
  
  scores.sort((a, b) => b.score - a.score);
  
  const topBooks = scores.slice(0, limit * 2);
  
  const shuffled = topBooks
    .map(item => ({
      ...item,
      randomBoost: Math.random() * 0.3
    }))
    .sort((a, b) => (b.score + b.randomBoost) - (a.score + a.randomBoost))
    .slice(0, limit);
  
  return shuffled.map(item => item.book);
}

export function isModelTrained(): boolean {
  return tfidf !== null && booksWithVectors.length > 0;
}
