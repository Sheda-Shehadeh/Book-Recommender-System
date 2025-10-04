import { SearchIcon, BookOpen, Sparkles, Rocket, Skull, Heart, Sword } from "lucide-react";
import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const MacbookPro = (): JSX.Element => {
  const allPopularBooks = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee" },
    { id: 3, title: "1984", author: "George Orwell" },
    { id: 4, title: "Pride and Prejudice", author: "Jane Austen" },
    { id: 5, title: "The Catcher in the Rye", author: "J.D. Salinger" },
    { id: 6, title: "The Hobbit", author: "J.R.R. Tolkien" },
    { id: 7, title: "Harry Potter", author: "J.K. Rowling" },
    { id: 8, title: "The Lord of the Rings", author: "J.R.R. Tolkien" },
    { id: 9, title: "Brave New World", author: "Aldous Huxley" },
    { id: 10, title: "The Book Thief", author: "Markus Zusak" },
  ];

  const [popularBooks] = React.useState(() => {
    const shuffled = [...allPopularBooks].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  });

  const moodCategories = [
    { id: 1, name: "Mystery", icon: SearchIcon, color: "#8b7355" },
    { id: 2, name: "Fantasy", icon: Sparkles, color: "#9b59b6" },
    { id: 3, name: "Sci-Fi", icon: Rocket, color: "#3498db" },
    { id: 4, name: "Horror", icon: Skull, color: "#e74c3c" },
    { id: 5, name: "Romance", icon: Heart, color: "#e91e63" },
    { id: 6, name: "Adventure", icon: Sword, color: "#f39c12" },
  ];

  return (
    <div className="bg-[#f1e3c8] min-h-screen w-full overflow-x-hidden">
      <div className="max-w-[1764px] mx-auto px-8 py-12">
        <header className="mb-20">
          <h1 className="[font-family:'Stoke',Helvetica] font-normal text-black text-5xl text-center tracking-[0] leading-[60px]">
            NextChapter
          </h1>
        </header>

        <main className="flex flex-col items-center gap-16">
          <section className="flex flex-col items-center gap-8 w-full max-w-4xl">
            <h2 className="[font-family:'Playfair_Display',Helvetica] font-normal text-black text-6xl text-center tracking-[0] leading-[normal]">
              Find your next favorite read
            </h2>

            <div className="relative w-full max-w-[491px]">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <div className="w-[26px] h-[26px] bg-[#fdeed2] rounded-full border-2 border-solid border-black flex items-center justify-center">
                  <SearchIcon className="w-3 h-3 text-black" strokeWidth={2} />
                </div>
              </div>
              <Input
                type="text"
                placeholder="What are you in the mood for?"
                className="w-full h-[81px] bg-[#fdeed1] rounded-[10px] border border-solid border-black pl-16 pr-6 [font-family:'Playfair',Helvetica] font-normal text-black text-[25px] placeholder:text-black placeholder:opacity-100"
              />
            </div>
          </section>

          <section className="w-full">
            <h3 className="[font-family:'Stoke',Helvetica] font-normal text-black text-3xl text-center tracking-[0] leading-[40px] mb-12">
              Popular books
            </h3>
            <div className="flex justify-center gap-[100px] flex-wrap">
              {popularBooks.map((book) => (
                <div key={book.id} className="flex flex-col items-center gap-3">
                  <Card className="w-[149px] h-[205px] bg-[#d9d9d9] border-2 border-solid border-black rounded-none cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-[#8b7355]" />
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
