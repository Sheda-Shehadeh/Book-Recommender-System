import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { ArrowLeft, BookOpen, BookMarked, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface UserBook {
  id: string;
  bookId: string;
  title: string;
  authors: string;
  coverUrl: string | null;
  description: string | null;
  status: string;
}

export function MyBooks() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [books, setBooks] = useState<UserBook[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to view your books.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBooks();
    }
  }, [isAuthenticated]);

  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/user/books");
      if (response.ok) {
        const data = await response.json();
        setBooks(data.books);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoadingBooks(false);
    }
  };

  const removeBook = async (bookId: string) => {
    try {
      const response = await fetch(`/api/user/books/${bookId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setBooks(books.filter(b => b.bookId !== bookId));
        toast({
          title: "Book removed",
          description: "The book has been removed from your list.",
        });
      }
    } catch (error) {
      console.error("Error removing book:", error);
      toast({
        title: "Error",
        description: "Failed to remove book.",
        variant: "destructive",
      });
    }
  };

  const updateStatus = async (bookId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/user/books/${bookId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setBooks(books.map(b => 
          b.bookId === bookId ? { ...b, status: newStatus } : b
        ));
        toast({
          title: "Status updated",
          description: `Book moved to ${newStatus === 'have_read' ? 'Have Read' : 'Want to Read'}.`,
        });
      }
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#f1e3c8] min-h-screen w-full flex items-center justify-center">
        <p className="[font-family:'Stoke',Helvetica] text-xl">Loading...</p>
      </div>
    );
  }

  const wantToRead = books.filter(b => b.status === 'want_to_read');
  const haveRead = books.filter(b => b.status === 'have_read');

  const BookCard = ({ book }: { book: UserBook }) => (
    <Card className="bg-[#fdeed1] border-2 border-black rounded-[10px] p-4 flex gap-4">
      <div className="w-[100px] h-[150px] bg-[#d9d9d9] border border-black rounded overflow-hidden flex-shrink-0">
        {book.coverUrl && (
          <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="flex-1 flex flex-col">
        <h4 className="[font-family:'Stoke',Helvetica] font-bold text-lg">{book.title}</h4>
        <p className="[font-family:'Stoke',Helvetica] text-sm text-gray-600 mb-2">{book.authors}</p>
        {book.description && (
          <p className="[font-family:'Stoke',Helvetica] text-sm text-gray-700 line-clamp-3 mb-auto">
            {book.description}
          </p>
        )}
        <div className="flex gap-2 mt-3">
          {book.status === 'want_to_read' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateStatus(book.bookId, 'have_read')}
              className="[font-family:'Stoke',Helvetica] text-xs"
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Mark as Read
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateStatus(book.bookId, 'want_to_read')}
              className="[font-family:'Stoke',Helvetica] text-xs"
            >
              <BookMarked className="w-4 h-4 mr-1" />
              Move to Want to Read
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => removeBook(book.bookId)}
            className="[font-family:'Stoke',Helvetica] text-xs text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="bg-[#f1e3c8] min-h-screen w-full">
      <div className="max-w-[1200px] mx-auto px-8 py-6">
        <header className="mb-6 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="[font-family:'Stoke',Helvetica]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="[font-family:'Stoke',Helvetica] font-normal text-black text-3xl">
            My Books
          </h1>
        </header>

        <Tabs defaultValue="want_to_read" className="w-full">
          <TabsList className="bg-[#fdeed1] border-2 border-black mb-6">
            <TabsTrigger 
              value="want_to_read" 
              className="[font-family:'Stoke',Helvetica] data-[state=active]:bg-[#8b7355] data-[state=active]:text-white"
            >
              <BookMarked className="w-4 h-4 mr-2" />
              Want to Read ({wantToRead.length})
            </TabsTrigger>
            <TabsTrigger 
              value="have_read"
              className="[font-family:'Stoke',Helvetica] data-[state=active]:bg-[#8b7355] data-[state=active]:text-white"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Have Read ({haveRead.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="want_to_read">
            {loadingBooks ? (
              <p className="[font-family:'Stoke',Helvetica] text-center text-gray-600">Loading...</p>
            ) : wantToRead.length === 0 ? (
              <div className="text-center py-12">
                <BookMarked className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="[font-family:'Stoke',Helvetica] text-xl text-gray-600">
                  No books in your reading list yet
                </p>
                <p className="[font-family:'Stoke',Helvetica] text-gray-500 mt-2">
                  Browse books and add them to your list!
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {wantToRead.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="have_read">
            {loadingBooks ? (
              <p className="[font-family:'Stoke',Helvetica] text-center text-gray-600">Loading...</p>
            ) : haveRead.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="[font-family:'Stoke',Helvetica] text-xl text-gray-600">
                  No books marked as read yet
                </p>
                <p className="[font-family:'Stoke',Helvetica] text-gray-500 mt-2">
                  Finish a book? Mark it as read!
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {haveRead.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
