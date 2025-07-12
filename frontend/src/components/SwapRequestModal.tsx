import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { swapApi } from '@/lib/api';

interface SwapRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetUser: User | null;
  // In a real app, we'd get current user from auth context
  currentUserId?: string;
}

// Mock skills for the current user - replace with actual data
const mockCurrentUserSkills = [
  { id: '1', name: 'React', type: 'offered' as const },
  { id: '2', name: 'TypeScript', type: 'offered' as const },
  { id: '3', name: 'Node.js', type: 'offered' as const },
];

const mockTargetUserSkills = [
  { id: '4', name: 'Photoshop', type: 'offered' as const },
  { id: '5', name: 'UI/UX Design', type: 'offered' as const },
  { id: '6', name: 'Figma', type: 'offered' as const },
];

export function SwapRequestModal({ 
  open, 
  onOpenChange, 
  targetUser,
  currentUserId = "current-user-123" // Mock current user ID
}: SwapRequestModalProps) {
  const [selectedOfferedSkill, setSelectedOfferedSkill] = useState<string>('');
  const [selectedRequestedSkill, setSelectedRequestedSkill] = useState<string>('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedOfferedSkill || !selectedRequestedSkill || !targetUser) {
      toast({
        title: "Missing Information",
        description: "Please select both skills to exchange",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await swapApi.createSwapRequest({
        requesterId: currentUserId,
        targetUserId: targetUser.id,
        offeredSkillId: selectedOfferedSkill,
        requestedSkillId: selectedRequestedSkill,
        status: 'pending',
        message: message.trim() || undefined
      });

      toast({
        title: "Request Sent!",
        description: `Your swap request has been sent to ${targetUser.name}`,
      });

      // Reset form and close modal
      setSelectedOfferedSkill('');
      setSelectedRequestedSkill('');
      setMessage('');
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "Failed to send swap request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setSelectedOfferedSkill('');
    setSelectedRequestedSkill('');
    setMessage('');
    onOpenChange(false);
  };

  if (!targetUser) return null;

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={targetUser.avatar} alt={targetUser.name} />
              <AvatarFallback className="bg-gradient-primary text-white">
                {targetUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            Request Skill Swap with {targetUser.name}
          </DialogTitle>
          <DialogDescription>
            Choose what you&apos;d like to offer and what you&apos;d like to learn from {targetUser.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* What you're offering */}
          <div className="space-y-3">
            <Label className="text-base font-medium">What can you teach?</Label>
            <div className="flex flex-wrap gap-2">
              {mockCurrentUserSkills.map((skill) => (
                <button
                  key={skill.id}
                  onClick={() => setSelectedOfferedSkill(skill.id)}
                  className={`transition-all duration-200 ${
                    selectedOfferedSkill === skill.id 
                      ? 'ring-2 ring-primary' 
                      : 'hover:scale-105'
                  }`}
                >
                  <Badge 
                    variant={selectedOfferedSkill === skill.id ? "default" : "secondary"}
                    className="cursor-pointer"
                  >
                    {skill.name}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* What you want to learn */}
          <div className="space-y-3">
            <Label className="text-base font-medium">What would you like to learn?</Label>
            <div className="flex flex-wrap gap-2">
              {mockTargetUserSkills.map((skill) => (
                <button
                  key={skill.id}
                  onClick={() => setSelectedRequestedSkill(skill.id)}
                  className={`transition-all duration-200 ${
                    selectedRequestedSkill === skill.id 
                      ? 'ring-2 ring-primary' 
                      : 'hover:scale-105'
                  }`}
                >
                  <Badge 
                    variant={selectedRequestedSkill === skill.id ? "default" : "outline"}
                    className="cursor-pointer"
                  >
                    {skill.name}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Optional message */}
          <div className="space-y-3">
            <Label htmlFor="message" className="text-base font-medium">
              Message (optional)
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Hi ${targetUser.name}, I'd love to learn from you! Let me know if you're interested in a skill swap.`}
              className="min-h-[80px]"
              maxLength={500}
            />
            <p className="text-sm text-muted-foreground">
              {message.length}/500 characters
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedOfferedSkill || !selectedRequestedSkill}
            variant="hero"
          >
            {isSubmitting ? "Sending..." : "Send Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}