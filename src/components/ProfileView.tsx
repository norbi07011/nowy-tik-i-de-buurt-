import { User, MapPin, Calendar, Heart, Bookmark } from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useKV } from "@github/spark/hooks"

export function ProfileView() {
  const [savedPosts] = useKV<string[]>("saved-posts", [])
  const [likedPosts] = useKV<string[]>("liked-posts", [])

  const savedCount = Array.isArray(savedPosts) ? savedPosts.length : 0
  const likedCount = Array.isArray(likedPosts) ? likedPosts.length : 0

  return (
    <div className="h-screen bg-background overflow-y-auto pb-20">
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-primary to-secondary"></div>
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <Avatar className="w-16 h-16 border-4 border-background">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              JD
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="pt-12 px-4 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold">John Doe</h1>
          <p className="text-muted-foreground text-sm">Local explorer & food lover</p>
          <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs">
            <MapPin size={12} weight="fill" />
            <span>Amsterdam, Netherlands</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{likedCount}</div>
              <div className="text-xs text-muted-foreground">Liked</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-warning">{savedCount}</div>
              <div className="text-xs text-muted-foreground">Saved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary">12</div>
              <div className="text-xs text-muted-foreground">Following</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Heart size={16} className="mr-2" />
              View Liked Posts
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Bookmark size={16} className="mr-2" />
              View Saved Posts
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <User size={16} className="mr-2" />
              Following Businesses
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Calendar size={16} className="mr-2" />
              Activity History
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Preferences</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Location</span>
              <Badge variant="outline">Amsterdam</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Interests</span>
              <div className="flex gap-1">
                <Badge variant="secondary" className="text-xs">Food</Badge>
                <Badge variant="secondary" className="text-xs">Art</Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Language</span>
              <Badge variant="outline">English</Badge>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button variant="destructive" className="w-full">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}