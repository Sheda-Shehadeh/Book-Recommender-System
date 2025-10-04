import { SearchIcon, Sparkles, Rocket, Skull, Heart } from "lucide-react";
import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import bookCover1 from "@assets/stock_images/book_covers_classic__295b9cdf.jpg";
import bookCover2 from "@assets/stock_images/book_covers_classic__5ffa13b6.jpg";
import bookCover3 from "@assets/stock_images/book_covers_classic__493c2412.jpg";
import bookCover4 from "@assets/stock_images/book_covers_classic__b612314b.jpg";
import bookCover5 from "@assets/stock_images/book_covers_classic__3aa29ca8.jpg";

export const MacbookPro = (): JSX.Element => {
  const allPopularBooks = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", cover: bookCover1 },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", cover: bookCover2 },
    { id: 3, title: "1984", author: "George Orwell", cover: bookCover3 },
    { id: 4, title: "Pride and Prejudice", author: "Jane Austen", cover: bookCover4 },
    { id: 5, title: "The Catcher in the Rye", author: "J.D. Salinger", cover: bookCover5 },
    { id: 6, title: "The Hobbit", author: "J.R.R. Tolkien", cover: bookCover1 },
    { id: 7, title: "Harry Potter", author: "J.K. Rowling", cover: bookCover2 },
    { id: 8, title: "The Lord of the Rings", author: "J.R.R. Tolkien", cover: bookCover3 },
    { id: 9, title: "Brave New World", author: "Aldous Huxley", cover: bookCover4 },
    { id: 10, title: "The Book Thief", author: "Markus Zusak", cover: bookCover5 },
  ];

  const [popularBooks, setPopularBooks] = React.useState(() => {
    const shuffled = [...allPopularBooks].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  });

  const [searchQuery, setSearchQuery] = React.useState("");
  const [showRecommendations, setShowRecommendations] = React.useState(false);

  const moodCategories = [
    { id: 1, name: "Mystery", icon: SearchIcon, color: "#8b7355" },
    { id: 2, name: "Fantasy", icon: Sparkles, color: "#9b59b6" },
    { id: 3, name: "Sci-Fi", icon: Rocket, color: "#3498db" },
    { id: 4, name: "Horror", icon: Skull, color: "#e74c3c" },
    { id: 5, name: "Romance", icon: Heart, color: "#e91e63" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const shuffled = [...allPopularBooks].sort(() => Math.random() - 0.5);
      setPopularBooks(shuffled.slice(0, 5));
      setShowRecommendations(true);
    }
  };

  const handleMoodClick = (mood: string) => {
    const shuffled = [...allPopularBooks].sort(() => Math.random() - 0.5);
    setPopularBooks(shuffled.slice(0, 5));
    setShowRecommendations(true);
  };

  return (
    <div className="bg-[#f1e3c8] min-h-screen w-full overflow-x-hidden">
      <div className="max-w-[1764px] mx-auto px-8 py-12">
        <header className="mb-20 flex justify-end">
          <h1 className="[font-family:'Stoke',Helvetica] font-normal text-black text-5xl tracking-[0] leading-[60px]">
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
                className="w-full h-[81px] bg-[#fdeed1] rounded-[10px] border border-solid border-black pl-16 pr-6 [font-family:'Playfair',Helvetica] font-normal text-black text-[25px] placeholder:text-black placeholder:opacity-100"
              />
            </form>
          </section>

          {showRecommendations && (
            <section className="w-full">
              <h3 className="[font-family:'Stoke',Helvetica] font-normal text-black text-3xl text-center tracking-[0] leading-[40px] mb-12">
                Recommended for you
              </h3>
              <div className="flex justify-center gap-[100px] flex-wrap">
                {popularBooks.map((book) => (
                  <div key={book.id} className="flex flex-col items-center gap-3">
                    <Card className="w-[149px] h-[205px] bg-[#d9d9d9] border-2 border-solid border-black rounded-none cursor-pointer hover:opacity-80 transition-opacity overflow-hidden">
                      <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
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
                    <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
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
