import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SkillBadgeProps {
  skill: string
  type?: "offered" | "wanted"
  className?: string
}

export function SkillBadge({ skill, type = "offered", className }: SkillBadgeProps) {
  return (
    <Badge 
      variant={type === "offered" ? "default" : "secondary"}
      className={cn(
        "transition-all duration-200 hover:scale-105",
        type === "offered" && "bg-gradient-primary hover:shadow-glow",
        type === "wanted" && "bg-accent/10 text-accent border-accent/20 hover:bg-accent/20",
        className
      )}
    >
      {skill}
    </Badge>
  )
}