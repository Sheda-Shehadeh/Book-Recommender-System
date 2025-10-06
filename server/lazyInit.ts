import { loadBooksData, getBooksData } from "./dataLoader";
import { trainModel, isModelTrained } from "./mlRecommender";
import { log } from "./vite";

let initializationPromise: Promise<void> | null = null;
let isInitialized = false;

export async function ensureInitialized(): Promise<void> {
  if (isInitialized) {
    return;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      log('Lazy loading CMU books dataset...');
      await loadBooksData();
      log('Dataset loaded successfully');
      
      log('Training ML recommendation model...');
      const books = getBooksData();
      trainModel(books);
      log('ML model trained successfully');
      
      isInitialized = true;
    } catch (error) {
      log(`Initialization failed: ${error}`);
      initializationPromise = null;
      throw error;
    }
  })();

  return initializationPromise;
}

export function getInitializationStatus(): { initialized: boolean; training: boolean } {
  return {
    initialized: isInitialized,
    training: initializationPromise !== null && !isInitialized
  };
}
