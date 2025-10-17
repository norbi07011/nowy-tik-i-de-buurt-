import { Compass, MapPin, Funnel } from "@phosphor-icons/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

const categories = [
  "All", "Restaurant", "Bakery", "Florist", "Fashion", "Electronics", "Sports", 
  "Bookstore", "Garden Center", "Art Gallery", "Crafts"
]

const businessGrid = [
  {
    id: "1",
    name: "Café Amsterdam",
    category: "Restaurant",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&h=200&fit=crop",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
    location: "Amsterdam Centrum",
    rating: 4.8,
    distance: "0.3 km"
  },
  {
    id: "2", 
    name: "Utrecht Bakery",
    category: "Bakery",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
    location: "Utrecht Binnenstad",
    rating: 4.6,
    distance: "1.2 km"
  },
  {
    id: "3",
    name: "Rotterdam Flowers", 
    category: "Florist",
    image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=300&h=200&fit=crop",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
    location: "Rotterdam Zuid",
    rating: 4.9,
    distance: "0.8 km"
  },
  {
    id: "4",
    name: "Den Haag Style",
    category: "Fashion", 
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face",
    location: "Den Haag West",
    rating: 4.7,
    distance: "2.1 km"
  },
  {
    id: "5",
    name: "Eindhoven Tech",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&crop=face", 
    location: "Eindhoven Centrum",
    rating: 4.5,
    distance: "1.7 km"
  },
  {
    id: "6",
    name: "Groningen Bikes",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
    location: "Groningen Noord", 
    rating: 4.8,
    distance: "0.9 km"
  }
]

export function DiscoverView() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredBusinesses = businessGrid.filter(business => {
    const matchesCategory = selectedCategory === "All" || business.category === selectedCategory
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="h-screen bg-background overflow-y-auto">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Compass size={24} className="text-primary" weight="fill" />
              <h1 className="text-xl font-bold">Discover</h1>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              <Funnel size={16} />
              Filters
            </Button>
          </div>
          
          <div className="relative">
            <Input
              placeholder="Search businesses, categories, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className="whitespace-nowrap"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 pb-20">
        <div className="grid grid-cols-2 gap-4">
          {filteredBusinesses.map((business) => (
            <Card key={business.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer">
              <div className="aspect-[4/3] relative">
                <img
                  src={business.image}
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs font-medium">
                    {business.distance}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={business.avatar} alt={business.name} />
                    <AvatarFallback className="text-xs">
                      {business.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm leading-tight truncate">
                      {business.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin size={10} weight="fill" />
                      <span className="truncate">{business.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {business.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium">⭐ {business.rating}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBusinesses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Compass size={32} className="text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No businesses found</h3>
            <p className="text-muted-foreground text-sm">
              Try adjusting your search or category filters
            </p>
          </div>
        )}
      </div>
    </div>
  )
}