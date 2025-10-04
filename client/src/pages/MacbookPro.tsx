import { SearchIcon, Sparkles, Rocket, Skull, Heart } from "lucide-react";
import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  moods: string[];
}

export const MacbookPro = (): JSX.Element => {
  const allBooks: Book[] = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "9780743273565", moods: ["romance", "drama", "classic", "tragic"] },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "9780061120084", moods: ["drama", "classic", "inspiring", "historical"] },
    { id: 3, title: "1984", author: "George Orwell", isbn: "9780451524935", moods: ["sci-fi", "dystopian", "thriller", "dark"] },
    { id: 4, title: "Pride and Prejudice", author: "Jane Austen", isbn: "9780141439518", moods: ["romance", "classic", "comedy", "lighthearted"] },
    { id: 5, title: "The Catcher in the Rye", author: "J.D. Salinger", isbn: "9780316769174", moods: ["drama", "young adult", "coming-of-age"] },
    { id: 6, title: "The Hobbit", author: "J.R.R. Tolkien", isbn: "9780547928227", moods: ["fantasy", "adventure", "classic", "epic"] },
    { id: 7, title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", isbn: "9780590353427", moods: ["fantasy", "adventure", "magic", "young adult"] },
    { id: 8, title: "The Lord of the Rings", author: "J.R.R. Tolkien", isbn: "9780618640157", moods: ["fantasy", "adventure", "epic", "classic"] },
    { id: 9, title: "Brave New World", author: "Aldous Huxley", isbn: "9780060850524", moods: ["sci-fi", "dystopian", "philosophical", "thought-provoking"] },
    { id: 10, title: "The Book Thief", author: "Markus Zusak", isbn: "9780375842207", moods: ["drama", "historical", "heartwarming", "young adult"] },
    { id: 11, title: "Dracula", author: "Bram Stoker", isbn: "9780486411095", moods: ["horror", "gothic", "classic", "vampire"] },
    { id: 12, title: "The Shining", author: "Stephen King", isbn: "9780307743657", moods: ["horror", "thriller", "supernatural", "suspense"] },
    { id: 13, title: "Frankenstein", author: "Mary Shelley", isbn: "9780486282114", moods: ["horror", "sci-fi", "gothic", "classic"] },
    { id: 14, title: "Gone Girl", author: "Gillian Flynn", isbn: "9780307588371", moods: ["mystery", "thriller", "psychological", "suspense"] },
    { id: 15, title: "The Adventures of Sherlock Holmes", author: "Arthur Conan Doyle", isbn: "9780486474915", moods: ["mystery", "detective", "classic", "thriller"] },
    { id: 16, title: "The Da Vinci Code", author: "Dan Brown", isbn: "9780307474278", moods: ["mystery", "thriller", "adventure", "suspense"] },
    { id: 17, title: "Dune", author: "Frank Herbert", isbn: "9780441172719", moods: ["sci-fi", "epic", "adventure", "space"] },
    { id: 18, title: "Foundation", author: "Isaac Asimov", isbn: "9780553293357", moods: ["sci-fi", "space", "philosophical", "epic"] },
    { id: 19, title: "The Notebook", author: "Nicholas Sparks", isbn: "9780446676090", moods: ["romance", "heartwarming", "emotional", "contemporary"] },
    { id: 20, title: "Outlander", author: "Diana Gabaldon", isbn: "9780440212560", moods: ["romance", "adventure", "historical", "time-travel"] },
    { id: 21, title: "The Hunger Games", author: "Suzanne Collins", isbn: "9780439023481", moods: ["young adult", "dystopian", "adventure", "action"] },
    { id: 22, title: "The Fault in Our Stars", author: "John Green", isbn: "9780525478812", moods: ["young adult", "romance", "emotional", "contemporary"] },
    { id: 23, title: "Percy Jackson: The Lightning Thief", author: "Rick Riordan", isbn: "9780786838653", moods: ["young adult", "fantasy", "adventure", "mythology"] },
    { id: 24, title: "Divergent", author: "Veronica Roth", isbn: "9780062024039", moods: ["young adult", "dystopian", "action", "romance"] },
    { id: 25, title: "The Maze Runner", author: "James Dashner", isbn: "9780385737951", moods: ["young adult", "dystopian", "thriller", "action"] },
  ];

  const getBookCover = (isbn: string) => {
    return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
  };

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
        <header className="mb-20 flex justify-start">
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
                className="w-full h-[81px] bg-[#fdeed1] rounded-[10px] border border-solid border-black pl-16 pr-6 [font-family:'Playfair',Helvetica] font-normal text-black text-[32px] placeholder:text-black placeholder:opacity-100"
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
                        src={getBookCover(book.isbn)} 
                        alt={book.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.style.backgroundColor = '#d9d9d9';
                        }}
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
                      src={getBookCover(book.isbn)} 
                      alt={book.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.style.backgroundColor = '#d9d9d9';
                      }}
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
