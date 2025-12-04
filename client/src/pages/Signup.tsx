import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, ArrowLeft } from "lucide-react";

export function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Error",
          description: data.message || "Failed to create account",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Welcome to NextChapter!",
        description: "Your account has been created.",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f1e3c8] min-h-screen w-full flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Link href="/">
          <Button variant="ghost" className="mb-6 [font-family:'Stoke',Helvetica]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <Card className="bg-[#fdeed1] border-2 border-black rounded-[20px] p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#8b7355] rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="[font-family:'Playfair_Display',Helvetica] text-3xl font-semibold text-black">
              Join NextChapter
            </h1>
            <p className="[font-family:'Stoke',Helvetica] text-gray-600 mt-2 text-center">
              Start your reading adventure today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="[font-family:'Stoke',Helvetica] text-black">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-[#f1e3c8] border-2 border-black rounded-[10px] h-12 [font-family:'Stoke',Helvetica] placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="[font-family:'Stoke',Helvetica] text-black">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-[#f1e3c8] border-2 border-black rounded-[10px] h-12 [font-family:'Stoke',Helvetica] placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="[font-family:'Stoke',Helvetica] text-black">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#f1e3c8] border-2 border-black rounded-[10px] h-12 [font-family:'Stoke',Helvetica] placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="[font-family:'Stoke',Helvetica] text-black">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#f1e3c8] border-2 border-black rounded-[10px] h-12 [font-family:'Stoke',Helvetica] placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="[font-family:'Stoke',Helvetica] text-black">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-[#f1e3c8] border-2 border-black rounded-[10px] h-12 [font-family:'Stoke',Helvetica] placeholder:text-gray-500"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#8b7355] hover:bg-[#6d5a44] text-white [font-family:'Stoke',Helvetica] text-lg rounded-[10px] border-2 border-black"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="[font-family:'Stoke',Helvetica] text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-[#8b7355] hover:underline font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
