import { Navigation } from "@/components/Navigation"
import { Hero } from "@/components/Hero"
import { FeaturedSkills } from "@/components/FeaturedSkills"

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <FeaturedSkills />
    </div>
  );
};

export default Index;
