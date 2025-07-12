import { Button } from "@/components/ui/button"
import { Users, Search, User, Plus } from "lucide-react"

export function Navigation() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SkillSwap
            </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Browse Skills
            </Button>
            <Button variant="ghost" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              My Profile
            </Button>
          </div>
          
          <Button variant="hero" size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Join Platform
          </Button>
        </div>
      </div>
    </nav>
  )
}