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

// No demo data - businesses will be loaded from Supabase
const businessGrid: any[] = []

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