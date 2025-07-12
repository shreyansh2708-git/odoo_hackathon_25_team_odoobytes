import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SkillBadge } from "./SkillBadge";
import { SwapRequestModal } from "./SwapRequestModal";
import { MapPin, Clock, Star, User } from "lucide-react";
import { User as UserType } from "@/types";

interface SkillCardProps {
  user: UserType;
}

// Mock skills for demo - in real app this would come from user data
const mockSkillsOffered = {
  '1': ['React', 'TypeScript', 'UI/UX Design'],
  '2': ['Photography', 'Adobe Lightroom', 'Video Editing'],
  '3': ['Digital Marketing', 'Content Writing', 'SEO'],
  '4': ['Data Analysis', 'Excel', 'SQL']
};

const mockSkillsWanted = {
  '1': ['Python', 'Machine Learning'],
  '2': ['Web Development', 'SEO'],
  '3': ['Graphic Design', 'Figma'],
  '4': ['JavaScript', 'React']
};

export function SkillCard({ user }: SkillCardProps) {
  const [showSwapModal, setShowSwapModal] = useState(false);
  
  // Get skills for this user (mock data)
  const skillsOffered = mockSkillsOffered[user.id as keyof typeof mockSkillsOffered] || [];
  const skillsWanted = mockSkillsWanted[user.id as keyof typeof mockSkillsWanted] || [];

  const handleRequestSwap = () => {
    setShowSwapModal(true);
  };

  const handleViewProfile = () => {
    // TODO: Navigate to user profile page
    console.log('View profile for user:', user.id);
  };

  return (
    <>
      <Card className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <Avatar className="w-12 h-12 ring-2 ring-primary/20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-lg">{user.name}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                {user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {user.location}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {user.rating.toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Skills Offered Section */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Skills Offered</h4>
            <div className="flex flex-wrap gap-1">
              {skillsOffered.map((skill) => (
                <SkillBadge key={skill} skill={skill} type="offered" />
              ))}
            </div>
          </div>
          
          {/* Skills Wanted Section */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Skills Wanted</h4>
            <div className="flex flex-wrap gap-1">
              {skillsWanted.map((skill) => (
                <SkillBadge key={skill} skill={skill} type="wanted" />
              ))}
            </div>
          </div>
          
          {/* Availability */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Available {user.availability}</span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="hero" 
              size="sm" 
              className="flex-1"
              onClick={handleRequestSwap}
            >
              Request Swap
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleViewProfile}
            >
              <User className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Swap Request Modal */}
      <SwapRequestModal
        open={showSwapModal}
        onOpenChange={setShowSwapModal}
        targetUser={user}
      />
    </>
  );
}