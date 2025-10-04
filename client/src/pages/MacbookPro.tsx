import { SearchIcon, Sparkles, Rocket, Skull, Heart } from "lucide-react";
import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import cover1 from "@assets/stock_images/elegant_classic_lite_3b9a67ec.jpg";
import cover2 from "@assets/stock_images/elegant_classic_lite_2051951d.jpg";
import cover3 from "@assets/stock_images/elegant_classic_lite_80292ed9.jpg";
import cover4 from "@assets/stock_images/elegant_classic_lite_bf098e7f.jpg";
import cover5 from "@assets/stock_images/elegant_classic_lite_c79cb897.jpg";
import cover6 from "@assets/stock_images/fantasy_fiction_book_6150932d.jpg";
import cover7 from "@assets/stock_images/fantasy_fiction_book_fc77aea5.jpg";
import cover8 from "@assets/stock_images/fantasy_fiction_book_df27d766.jpg";
import cover9 from "@assets/stock_images/sci-fi_science_ficti_31d5b682.jpg";
import cover10 from "@assets/stock_images/elegant_classic_lite_a1686e5c.jpg";
import cover11 from "@assets/stock_images/horror_mystery_thril_0832513d.jpg";
import cover12 from "@assets/stock_images/horror_mystery_thril_466b7dd7.jpg";
import cover13 from "@assets/stock_images/horror_mystery_thril_49edd180.jpg";
import cover14 from "@assets/stock_images/horror_mystery_thril_9f4a8ba6.jpg";
import cover15 from "@assets/stock_images/horror_mystery_thril_247291db.jpg";
import cover16 from "@assets/stock_images/elegant_classic_lite_456bb967.jpg";
import cover17 from "@assets/stock_images/sci-fi_science_ficti_c0ccb0b2.jpg";
import cover18 from "@assets/stock_images/sci-fi_science_ficti_c369d783.jpg";
import cover19 from "@assets/stock_images/elegant_classic_lite_c7350e96.jpg";
import cover20 from "@assets/stock_images/elegant_classic_lite_0a9a8ed7.jpg";
import cover21 from "@assets/stock_images/sci-fi_science_ficti_b77a4d5e.jpg";
import cover22 from "@assets/stock_images/elegant_classic_lite_4a8c1b3b.jpg";
import cover23 from "@assets/stock_images/fantasy_fiction_book_8fd781ce.jpg";
import cover24 from "@assets/stock_images/sci-fi_science_ficti_2e242755.jpg";
import cover25 from "@assets/stock_images/fantasy_fiction_book_1511c462.jpg";

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  moods: string[];
}

export const MacbookPro = (): JSX.Element => {
  const allBooks: Book[] = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", cover: cover1, moods: ["romance", "drama", "classic", "tragic"] },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", cover: cover2, moods: ["drama", "classic", "inspiring", "historical"] },
    { id: 3, title: "1984", author: "George Orwell", cover: cover3, moods: ["sci-fi", "dystopian", "thriller", "dark"] },
    { id: 4, title: "Pride and Prejudice", author: "Jane Austen", cover: cover4, moods: ["romance", "classic", "comedy", "lighthearted"] },
    { id: 5, title: "The Catcher in the Rye", author: "J.D. Salinger", cover: cover5, moods: ["drama", "young adult", "coming-of-age"] },
    { id: 6, title: "The Hobbit", author: "J.R.R. Tolkien", cover: cover6, moods: ["fantasy", "adventure", "classic", "epic"] },
    { id: 7, title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", cover: cover7, moods: ["fantasy", "adventure", "magic", "young adult"] },
    { id: 8, title: "The Lord of the Rings", author: "J.R.R. Tolkien", cover: cover8, moods: ["fantasy", "adventure", "epic", "classic"] },
    { id: 9, title: "Brave New World", author: "Aldous Huxley", cover: cover9, moods: ["sci-fi", "dystopian", "philosophical", "thought-provoking"] },
    { id: 10, title: "The Book Thief", author: "Markus Zusak", cover: cover10, moods: ["drama", "historical", "heartwarming", "young adult"] },
    { id: 11, title: "Dracula", author: "Bram Stoker", cover: cover11, moods: ["horror", "gothic", "classic", "vampire"] },
    { id: 12, title: "The Shining", author: "Stephen King", cover: cover12, moods: ["horror", "thriller", "supernatural", "suspense"] },
    { id: 13, title: "Frankenstein", author: "Mary Shelley", cover: cover13, moods: ["horror", "sci-fi", "gothic", "classic"] },
    { id: 14, title: "Gone Girl", author: "Gillian Flynn", cover: cover14, moods: ["mystery", "thriller", "psychological", "suspense"] },
    { id: 15, title: "The Adventures of Sherlock Holmes", author: "Arthur Conan Doyle", cover: cover15, moods: ["mystery", "detective", "classic", "thriller"] },
    { id: 16, title: "The Da Vinci Code", author: "Dan Brown", cover: cover16, moods: ["mystery", "thriller", "adventure", "suspense"] },
    { id: 17, title: "Dune", author: "Frank Herbert", cover: cover17, moods: ["sci-fi", "epic", "adventure", "space"] },
    { id: 18, title: "Foundation", author: "Isaac Asimov", cover: cover18, moods: ["sci-fi", "space", "philosophical", "epic"] },
    { id: 19, title: "The Notebook", author: "Nicholas Sparks", cover: cover19, moods: ["romance", "heartwarming", "emotional", "contemporary"] },
    { id: 20, title: "Outlander", author: "Diana Gabaldon", cover: cover20, moods: ["romance", "adventure", "historical", "time-travel"] },
    { id: 21, title: "The Hunger Games", author: "Suzanne Collins", cover: cover21, moods: ["young adult", "dystopian", "adventure", "action"] },
    { id: 22, title: "The Fault in Our Stars", author: "John Green", cover: cover22, moods: ["young adult", "romance", "emotional", "contemporary"] },
    { id: 23, title: "Percy Jackson: The Lightning Thief", author: "Rick Riordan", cover: cover23, moods: ["young adult", "fantasy", "adventure", "mythology"] },
    { id: 24, title: "Divergent", author: "Veronica Roth", cover: cover24, moods: ["young adult", "dystopian", "action", "romance"] },
    { id: 25, title: "The Maze Runner", author: "James Dashner", cover: cover25, moods: ["young adult", "dystopian", "thriller", "action"] },
  ];

  const [popularBooks] = React.useState(() => {
    const shuffled = [...allBooks].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  });

  const [searchQuery, setSearchQuery] = React.useState("");
  const [recommendedBooks, setRecommendedBooks] = React.useState<Book[]>([]);
  const [showRecommendations, setShowRecommendations] = React.useState(false);

  const moodCategories = [
    { id: 1, name: "Mystery", icon: SearchIcon, color: "#8b7355" },
    { id: 2, name: "Fantasy", icon: Sparkles, color: "#9b59b6" },
    { id: 3, name: "Sci-Fi", icon: Rocket, color: "#3498db" },
    { id: 4, name: "Horror", icon: Skull, color: "#e74c3c" },
    { id: 5, name: "Romance", icon: Heart, color: "#e91e63" },
  ];

  const findBooksByMood = (moodQuery: string): Book[] => {
    const query = moodQuery.toLowerCase().trim();
    const queryWords = query.split(/\s+/);
    
    const matchingBooks = allBooks.filter(book => {
      return book.moods.some(mood => {
        const moodWords = mood.toLowerCase().split(/[-\s]+/);
        return queryWords.some(queryWord => 
          moodWords.some(moodWord => 
            moodWord.includes(queryWord) || queryWord.includes(moodWord)
          )
        );
      });
    });
    
    if (matchingBooks.length === 0) {
      const shuffled = [...allBooks].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 5);
    }
    
    const shuffled = matchingBooks.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(5, shuffled.length));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const books = findBooksByMood(searchQuery);
      setRecommendedBooks(books);
      setShowRecommendations(true);
    }
  };

  const handleMoodClick = (mood: string) => {
    const books = findBooksByMood(mood);
    setRecommendedBooks(books);
    setShowRecommendations(true);
    setSearchQuery(mood);
  };

  return (
    <div className="bg-[#f1e3c8] min-h-screen w-full overflow-x-hidden">
      <div className="max-w-[1764px] mx-auto px-8 py-12">
        <header className="mb-12 flex justify-start">
          <h1 className="[font-family:'Stoke',Helvetica] font-normal text-black text-3xl tracking-[0] leading-[40px]">
            NextChapter
          </h1>
        </header>

        <main className="flex flex-col items-center gap-16">
          <section className="flex flex-col items-center gap-8 w-full max-w-4xl">
            <h2 className="[font-family:'Playfair_Display',Helvetica] font-normal text-black text-6xl text-center tracking-[0] leading-[normal]">
              Find your next favorite read
            </h2>

            <form onSubmit={handleSearch} className="relative w-full max-w-[491px]">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <SearchIcon className="w-5 h-5 text-black" strokeWidth={2} />
              </div>
              <Input
                type="text"
                placeholder="What are you in the mood for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[81px] bg-[#fdeed1] rounded-[10px] border border-solid border-black pl-16 pr-6 [font-family:'Playfair',Helvetica] font-normal text-black text-[32px] placeholder:text-[32px] placeholder:text-black placeholder:opacity-100"
              />
            </form>
          </section>

          {showRecommendations && (
            <section className="w-full">
              <h3 className="[font-family:'Stoke',Helvetica] font-normal text-black text-3xl text-center tracking-[0] leading-[40px] mb-12">
                Recommended for you
              </h3>
              <div className="flex justify-center gap-[100px] flex-wrap">
                {recommendedBooks.map((book) => (
                  <div key={book.id} className="flex flex-col items-center gap-3">
                    <Card className="w-[149px] h-[205px] bg-[#d9d9d9] border-2 border-solid border-black rounded-none cursor-pointer hover:opacity-80 transition-opacity overflow-hidden">
                      <img 
                        src={book.cover} 
                        alt={book.title} 
                        className="w-full h-full object-cover"
                      />
                    </Card>
                    <div className="text-center max-w-[149px]">
                      <p className="[font-family:'Stoke',Helvetica] font-normal text-black text-sm leading-tight">
                        {book.title}
                      </p>
                      <p className="[font-family:'Stoke',Helvetica] font-normal text-black text-xs opacity-70 mt-1">
                        {book.author}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="w-full">
            <h3 className="[font-family:'Stoke',Helvetica] font-normal text-black text-3xl text-center tracking-[0] leading-[40px] mb-12">
              Popular books
            </h3>
            <div className="flex justify-center gap-[100px] flex-wrap">
              {popularBooks.map((book) => (
                <div key={book.id} className="flex flex-col items-center gap-3">
                  <Card className="w-[149px] h-[205px] bg-[#d9d9d9] border-2 border-solid border-black rounded-none cursor-pointer hover:opacity-80 transition-opacity overflow-hidden">
                    <img 
                      src={book.cover} 
                      alt={book.title} 
                      className="w-full h-full object-cover"
                    />
                  </Card>
                  <div className="text-center max-w-[149px]">
                    <p className="[font-family:'Stoke',Helvetica] font-normal text-black text-sm leading-tight">
                      {book.title}
                    </p>
                    <p className="[font-family:'Stoke',Helvetica] font-normal text-black text-xs opacity-70 mt-1">
                      {book.author}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="w-full">
            <h3 className="[font-family:'Stoke',Helvetica] font-normal text-black text-3xl text-center tracking-[0] leading-[40px] mb-12">
              Explore by mood
            </h3>
            <div className="flex justify-center gap-[100px] flex-wrap">
              {moodCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <div key={category.id} className="flex flex-col items-center gap-3">
                    <Card 
                      onClick={() => handleMoodClick(category.name)}
                      className="w-[159px] h-[134px] bg-[#d9d9d9] border-2 border-solid border-black rounded-none cursor-pointer hover:opacity-80 transition-opacity flex flex-col items-center justify-center gap-2"
                    >
                      <Icon className="w-10 h-10" style={{ color: category.color }} />
                      <p className="[font-family:'Stoke',Helvetica] font-normal text-black text-lg">
                        {category.name}
                      </p>
                    </Card>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
