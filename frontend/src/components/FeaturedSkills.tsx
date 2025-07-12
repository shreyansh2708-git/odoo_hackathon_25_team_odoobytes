import React from "react";
import { SkillCard } from "./SkillCard";
import { useUsers } from "@/hooks/useUsers";
import { Loader } from "lucide-react";

export function FeaturedSkills() {
  const { users, loading, error } = useUsers();

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">Loading skill swappers...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-destructive">Error loading users: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured Skill Swappers
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with talented individuals ready to share their expertise and learn new skills
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {users.map((user, index) => (
            <div 
              key={user.id} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <SkillCard user={user} />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">Ready to join our community?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-primary text-white px-8 py-3 rounded-lg font-medium hover:shadow-elegant hover:scale-105 transition-all duration-300">
              Create Your Profile
            </button>
            <button className="border border-primary/20 text-primary px-8 py-3 rounded-lg font-medium hover:bg-primary/5 transition-all duration-300">
              Explore All Skills
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}