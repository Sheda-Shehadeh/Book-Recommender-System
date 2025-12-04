import { SearchIcon, Sparkles, Rocket, Skull, Heart, BookMarked, BookOpen, User, LogOut } from "lucide-react";
import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface Book {
  id: string;
  title: string;
  authors: string[];
  description: string;
  categories: string[];
  coverUrl: string;
  publishedDate: string;
  averageRating?: number;
  summary?: string;
}

export const MacbookPro = (): JSX.Element => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [popularBooks, setPopularBooks] = React.useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [recommendedBooks, setRecommendedBooks] = React.useState<Book[]>([]);
  const [showRecommendations, setShowRecommendations] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [savedBooks, setSavedBooks] = React.useState<Set<string>>(new Set());

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

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchSavedBooks();
    }
  }, [isAuthenticated]);

  const fetchPopularBooks = async () => {
    try {
      const response = await fetch('/api/books/popular');
      const data = await response.json();
      setPopularBooks(data.books.slice(0, 5));
    } catch (error) {
      console.error("Error fetching popular books:", error);
    }
  };

  const fetchSavedBooks = async () => {
    try {
      const response = await fetch('/api/user/books');
      if (response.ok) {
        const data = await response.json();
        setSavedBooks(new Set(data.books.map((b: any) => b.bookId)));
      }
    } catch (error) {
      console.error("Error fetching saved books:", error);
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

  const saveBook = async (book: Book, status: 'want_to_read' | 'have_read') => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save books.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/user/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: book.id,
          title: book.title,
          authors: book.authors.join(', '),
          coverUrl: book.coverUrl,
          description: book.description || book.summary,
          status,
        }),
      });

      if (response.ok) {
        setSavedBooks(prev => new Set([...Array.from(prev), book.id]));
        toast({
          title: "Book saved!",
          description: `Added to ${status === 'want_to_read' ? 'Want to Read' : 'Have Read'}.`,
        });
      }
    } catch (error) {
      console.error("Error saving book:", error);
      toast({
        title: "Error",
        description: "Failed to save book.",
        variant: "destructive",
      });
    }
  };

  const BookCard = ({ book, testIdPrefix }: { book: Book; testIdPrefix: string }) => {
    const truncateText = (text: string, maxLength: number) => {
      if (text.length <= maxLength) return text;
      let truncated = text.substring(0, maxLength);
      const lastSpaceIndex = truncated.lastIndexOf(' ');
      if (lastSpaceIndex > 0) {
        truncated = truncated.substring(0, lastSpaceIndex);
      }
      return truncated + '...';
    };

    const isSaved = savedBooks.has(book.id);

    return (
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div className="flex flex-col items-center gap-3">
            <div 
              data-testid={`${testIdPrefix}-${book.id}`}
              className="w-[135px] h-[224px] bg-[#d9d9d9] border-2 border-solid border-black rounded-[10px] cursor-pointer hover:opacity-80 transition-opacity overflow-hidden relative"
            >
              <img 
                src={book.coverUrl} 
                alt={book.title} 
                className="w-full h-full object-cover block"
              />
              {isSaved && (
                <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                  <BookMarked className="w-3 h-3" />
                </div>
              )}
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
        </HoverCardTrigger>
        <HoverCardContent 
          side="top" 
          align="center"
          className="w-[320px] bg-[#fdeed1] border-2 border-solid border-black rounded-[10px] p-4"
          data-testid={`hover-details-${book.id}`}
        >
          <div className="space-y-3">
            <div>
              <h4 className="[font-family:'Stoke',Helvetica] font-bold text-black text-base leading-tight">
                {book.title}
              </h4>
              <p className="[font-family:'Stoke',Helvetica] font-normal text-black text-sm opacity-70 mt-1">
                by {book.authors.join(', ')}
              </p>
            </div>
            
            {book.categories && book.categories.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {book.categories.slice(0, 3).map((category, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-1 bg-[#8b7355] text-white text-xs rounded-md [font-family:'Stoke',Helvetica]"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}
            
            {(book.description || book.summary) && (
              <p className="[font-family:'Stoke',Helvetica] font-normal text-black text-sm leading-relaxed">
                {truncateText(book.description || book.summary || '', 200)}
              </p>
            )}
            
            <div className="flex items-center justify-between text-xs [font-family:'Stoke',Helvetica] opacity-70">
              {book.publishedDate && (
                <span>Published: {new Date(book.publishedDate).getFullYear()}</span>
              )}
              {book.averageRating && (
                <span>★ {book.averageRating.toFixed(1)}</span>
              )}
            </div>

            {isAuthenticated && (
              <div className="flex gap-2 pt-2 border-t border-black/20">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    saveBook(book, 'want_to_read');
                  }}
                  className="flex-1 [font-family:'Stoke',Helvetica] text-xs"
                  disabled={isSaved}
                >
                  <BookMarked className="w-3 h-3 mr-1" />
                  Want to Read
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    saveBook(book, 'have_read');
                  }}
                  className="flex-1 [font-family:'Stoke',Helvetica] text-xs"
                  disabled={isSaved}
                >
                  <BookOpen className="w-3 h-3 mr-1" />
                  Have Read
                </Button>
              </div>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  };

  return (
    <div className="bg-[#f1e3c8] min-h-screen w-full overflow-x-hidden">
      <div className="max-w-[1764px] mx-auto px-8 py-6">
        <header className="mb-1 flex justify-between items-center">
          <h1 className="[font-family:'Stoke',Helvetica] font-normal text-black text-3xl tracking-[0] leading-[40px]">
            NextChapter
          </h1>
          
          <div className="flex items-center gap-4">
            {authLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse" />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 [font-family:'Stoke',Helvetica]">
                    {(user as any).profileImageUrl ? (
                      <img 
                        src={(user as any).profileImageUrl} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full object-cover border-2 border-black"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#8b7355] flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <span className="hidden sm:inline">
                      {(user as any).firstName || (user as any).email?.split('@')[0] || 'User'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#fdeed1] border-2 border-black">
                  <DropdownMenuItem asChild>
                    <Link href="/my-books" className="flex items-center gap-2 [font-family:'Stoke',Helvetica] cursor-pointer">
                      <BookMarked className="w-4 h-4" />
                      My Books
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => window.location.href = '/api/logout'}
                    className="flex items-center gap-2 [font-family:'Stoke',Helvetica] cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-[#8b7355] hover:bg-[#6d5a44] text-white [font-family:'Stoke',Helvetica]"
              >
                Sign In
              </Button>
            )}
          </div>
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
                  <BookCard key={book.id} book={book} testIdPrefix="card-book" />
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
                  <BookCard key={book.id} book={book} testIdPrefix="card-popular" />
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
