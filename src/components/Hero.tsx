import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "./SearchBar";

import { Users, ArrowRight, Star } from "lucide-react";

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement actual search functionality
    console.log("Searching for:", query);
  };
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero opacity-10" />
      
      <div className="container mx-auto px-4 py-24 relative">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            Join thousands of skill swappers
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Exchange Skills,{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Build Communities
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            Connect with like-minded learners. Share what you know, learn what you need. 
            Transform skills into meaningful connections.
          </p>
          
          {/* Search bar */}
          <div className="max-w-md mx-auto mb-8">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search skills (e.g., Photoshop, Excel)"
              className="w-full"
            />
          </div>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="xl" className="group">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="xl">
              <Users className="w-5 h-5 mr-2" />
              Browse Community
            </Button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 animate-slide-up">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">2,500+</div>
            <div className="text-muted-foreground">Active Members</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">12,000+</div>
            <div className="text-muted-foreground">Skills Exchanged</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">4.8★</div>
            <div className="text-muted-foreground">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  )
}