import { SearchIcon } from "lucide-react";
import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const MacbookPro = (): JSX.Element => {
  const popularBooks = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

  const moodCategories = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
  ];

  return (
    <div className="bg-[#f1e3c8] min-h-screen w-full overflow-x-hidden">
      <div className="max-w-[1764px] mx-auto px-8 py-12">
        <header className="mb-20">
          <h1 className="[font-family:'Stoke',Helvetica] font-normal text-black text-5xl text-center tracking-[0] leading-[22px]">
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
            <h3 className="[font-family:'Stoke',Helvetica] font-normal text-black text-3xl text-center tracking-[0] leading-[22px] mb-12">
              Popular books
            </h3>
            <div className="flex justify-center gap-[100px] flex-wrap">
              {popularBooks.map((book) => (
                <Card
                  key={book.id}
                  className="w-[149px] h-[205px] bg-[#d9d9d9] border-0 rounded-none cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
            </div>
          </section>

          <section className="w-full">
            <h3 className="[font-family:'Stoke',Helvetica] font-normal text-black text-3xl text-center tracking-[0] leading-[22px] mb-12">
              Explore by mood
            </h3>
            <div className="flex justify-center gap-[100px] flex-wrap">
              {moodCategories.map((category) => (
                <Card
                  key={category.id}
                  className="w-[159px] h-[134px] bg-[#d9d9d9] border-0 rounded-none cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
