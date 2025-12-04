import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { MacbookPro } from "@/pages/MacbookPro";
import { MyBooks } from "@/pages/MyBooks";
import { Login } from "@/pages/Login";
import { Signup } from "@/pages/Signup";

function Router() {
  return (
    <Switch>
      <Route path="/" component={MacbookPro} />
      <Route path="/my-books" component={MyBooks} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
