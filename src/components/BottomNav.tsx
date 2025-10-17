import { House, Compass, Plus, Heart, User } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const navItems = [
    { id: "home", icon: House, label: "Home" },
    { id: "discover", icon: Compass, label: "Discover" },
    { id: "create", icon: Plus, label: "Create" },
    { id: "saved", icon: Heart, label: "Saved" },
    { id: "profile", icon: User, label: "Profile" }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/10 z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon
          const isActive = activeTab === item.id
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={cn(
                "flex-1 flex flex-col items-center gap-1 h-12 rounded-lg transition-colors",
                isActive 
                  ? "bg-primary/20 text-primary" 
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <IconComponent 
                size={20} 
                weight={isActive ? "fill" : "regular"}
              />
              <span className="text-xs font-medium">
                {item.label}
              </span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}