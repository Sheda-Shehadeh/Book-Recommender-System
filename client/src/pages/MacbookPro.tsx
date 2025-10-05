import { SearchIcon, Sparkles, Rocket, Skull, Heart } from "lucide-react";
import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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

export const MacbookPro = (): JSX.Element => {
  const [popularBooks, setPopularBooks] = React.useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [recommendedBooks, setRecommendedBooks] = React.useState<Book[]>([]);
  const [showRecommendations, setShowRecommendations] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const moodCategories = [
    { id: 1, name: "Mystery", icon: SearchIcon, color: "#8b7355" },
    { id: 2, name: "Fantasy", icon: Sparkles, color: "#9b59b6" },
    { id: 3, name: "Sci-Fi", icon: Rocket, color: "#3498db" },
    { id: 4, name: "Horror", icon: Skull, color: "#e74c3c" },
    { id: 5, name: "Romance", icon: Heart, color: "#e91e63" },
  ];

  React.useEffect(() => {
    fetchPopularBooks();
  }, []);

  const fetchPopularBooks = async () => {
    try {
      const response = await fetch('/api/books/popular');
      const data = await response.json();
      setPopularBooks(data.books.slice(0, 5));
    } catch (error) {
      console.error("Error fetching popular books:", error);
    }
  };

  const fetchRecommendations = async (mood: string) => {
    setIsLoading(true);
    try {
      const randomSeed = Math.floor(Math.random() * 10000);
      const response = await fetch(`/api/books/recommend?mood=${encodeURIComponent(mood)}&limit=10&seed=${randomSeed}`);
      const data = await response.json();
      setRecommendedBooks(data.books.slice(0, 5));
      setShowRecommendations(true);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchRecommendations(searchQuery);
    }
  };

  const handleMoodClick = (mood: string) => {
    setSearchQuery(mood);
    fetchRecommendations(mood);
  };

  return (
    <div className="bg-[#f1e3c8] min-h-screen w-full overflow-x-hidden">
      <div className="max-w-[1764px] mx-auto px-8 py-6">
        <header className="mb-1 flex justify-start">
          <h1 className="[font-family:'Stoke',Helvetica] font-normal text-black text-3xl tracking-[0] leading-[40px]">
            NextChapter
          </h1>
        </header>

        <main className="flex flex-col items-center gap-12">
          <section className="flex flex-col items-center gap-6 w-full max-w-4xl">
            <h2 className="[font-family:'Playfair_Display',Helvetica] font-normal text-black text-[3.5rem] text-center tracking-[0] leading-[normal]">
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
                data-testid="input-search"
                className="w-full h-[70px] bg-[#fdeed1] rounded-[10px] border border-solid border-black pl-12 pr-6 [font-family:'Playfair',Helvetica] font-normal text-black !text-xl placeholder:text-xl placeholder:text-gray-500 placeholder:opacity-100"
              />
            </form>
          </section>

          {isLoading && (
            <section className="w-full">
              <h3 className="[font-family:'Stoke',Helvetica] font-normal text-black text-3xl text-center tracking-[0] leading-[40px] mb-12">
                Finding perfect books for you...
              </h3>
            </section>
          )}

          {showRecommendations && !isLoading && (
            <section className="w-full">
              <h3 className="[font-family:'Stoke',Helvetica] font-normal text-black text-3xl text-center tracking-[0] leading-[40px] mb-12">
                Recommended for you
              </h3>
              <div className="flex justify-center gap-[100px] flex-wrap">
                {recommendedBooks.map((book) => (
                  <div key={book.id} className="flex flex-col items-center gap-3">
                    <div 
                      data-testid={`card-book-${book.id}`}
                      className="w-[135px] h-[224px] bg-[#d9d9d9] border-2 border-solid border-black rounded-[10px] cursor-pointer hover:opacity-80 transition-opacity overflow-hidden"
                    >
                      <img 
                        src={book.coverUrl} 
                        alt={book.title} 
                        className="w-full h-full object-cover block"
                      />
                    </div>
                    <div className="text-center max-w-[135px]">
                      <p 
                        data-testid={`text-title-${book.id}`}
                        className="[font-family:'Stoke',Helvetica] font-normal text-black text-sm leading-tight"
                      >
                        {book.title}
                      </p>
                      <p className="[font-family:'Stoke',Helvetica] font-normal text-black text-xs opacity-70 mt-1">
                        {book.authors.join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {!showRecommendations && (
            <section className="w-full">
              <h3 className="[font-family:'Stoke',Helvetica] font-normal text-black text-3xl text-center tracking-[0] leading-[40px] mb-12">
                Popular books
              </h3>
              <div className="flex justify-center gap-[100px] flex-wrap">
                {popularBooks.map((book) => (
                  <div key={book.id} className="flex flex-col items-center gap-3">
                    <div 
                      data-testid={`card-popular-${book.id}`}
                      className="w-[135px] h-[224px] bg-[#d9d9d9] border-2 border-solid border-black rounded-[10px] cursor-pointer hover:opacity-80 transition-opacity overflow-hidden"
                    >
                      <img 
                        src={book.coverUrl} 
                        alt={book.title} 
                        className="w-full h-full object-cover block"
                      />
                    </div>
                    <div className="text-center max-w-[135px]">
                      <p 
                        data-testid={`text-popular-title-${book.id}`}
                        className="[font-family:'Stoke',Helvetica] font-normal text-black text-sm leading-tight"
                      >
                        {book.title}
                      </p>
                      <p className="[font-family:'Stoke',Helvetica] font-normal text-black text-xs opacity-70 mt-1">
                        {book.authors.join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

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
                      data-testid={`button-mood-${category.name.toLowerCase()}`}
                      className="w-[130px] h-[110px] bg-[#fdeed1] border-2 border-solid border-black rounded-[10px] cursor-pointer hover:opacity-80 transition-opacity flex flex-col items-center justify-center gap-2"
                    >
                      <Icon className="w-8 h-8" style={{ color: category.color }} />
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
