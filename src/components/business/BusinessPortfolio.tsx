import { useState } from "react"
import { useKV } from "@github/spark/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, Briefcase, Image, Video, FileText, Star, Eye, Download } from "lucide-react"

interface PortfolioItem {
  id: string
  title: string
  description: string
  category: string
  type: "image" | "video" | "document"
  url: string
  thumbnail?: string
  tags: string[]
  client?: string
  date: string
  featured: boolean
  views: number
}

export function BusinessPortfolio() {
  const [portfolioItems, setPortfolioItems] = useKV<PortfolioItem[]>("business-portfolio", [
    {
      id: "1",
      title: "Projekt strony internetowej",
      description: "Nowoczesna strona internetowa dla lokalnej firmy",
      category: "Web Design",
      type: "image",
      url: "/api/placeholder/600/400",
      tags: ["website", "design", "responsive"],
      client: "Firma ABC",
      date: "2024-01-15",
      featured: true,
      views: 234
    },
    {
      id: "2",
      title: "Kampania marketingowa",
      description: "Kompleksowa kampania reklamowa zwiększająca sprzedaż o 35%",
      category: "Marketing",
      type: "document",
      url: "/portfolio/case-study.pdf",
      tags: ["marketing", "case-study", "results"],
      client: "Sklep XYZ",
      date: "2024-01-10",
      featured: false,
      views: 156
    }
  ])

  const [selectedCategory, setSelectedCategory] = useState("all")
  const categories = ["all", "Web Design", "Marketing", "Photography", "Consulting"]

  const filteredItems = selectedCategory === "all" 
    ? portfolioItems || []
    : (portfolioItems || []).filter(item => item.category === selectedCategory)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image": return <Image className="w-4 h-4" />
      case "video": return <Video className="w-4 h-4" />
      case "document": return <FileText className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Portfolio</h2>
          <p className="text-muted-foreground">Pokaż swoje najlepsze prace i osiągnięcia</p>
        </div>
        <Button>
          <Award className="w-4 h-4 mr-2" />
          Dodaj projekt
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{portfolioItems?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Projektów</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {(portfolioItems || []).filter(item => item.featured).length}
            </div>
            <div className="text-sm text-muted-foreground">Wyróżnione</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {(portfolioItems || []).reduce((sum, item) => sum + item.views, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Wyświetleń</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {new Set((portfolioItems || []).map(item => item.category)).size}
            </div>
            <div className="text-sm text-muted-foreground">Kategorii</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category === "all" ? "Wszystkie" : category}
          </Button>
        ))}
      </div>

      {/* Portfolio Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <Card key={item.id} className="overflow-hidden group">
            <div className="relative">
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-48 bg-muted flex items-center justify-center">
                  {getTypeIcon(item.type)}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {item.type === "video" ? "Video" : "Dokument"}
                  </span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button size="sm" variant="secondary">
                  <Eye className="w-4 h-4 mr-1" />
                  Zobacz
                </Button>
              </div>
              
              <div className="absolute top-2 left-2 flex gap-2">
                <Badge variant="secondary">{item.category}</Badge>
                {item.featured && (
                  <Badge variant="default" className="bg-yellow-500">
                    <Star className="w-3 h-3 mr-1" />
                    Wyróżnione
                  </Badge>
                )}
              </div>
              
              <div className="absolute top-2 right-2">
                {getTypeIcon(item.type)}
              </div>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
              
              {item.client && (
                <div className="flex items-center text-xs text-muted-foreground mb-2">
                  <Briefcase className="w-3 h-3 mr-1" />
                  {item.client}
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <div className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {item.views}
                </div>
                <span>{item.date}</span>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">#{tag}</Badge>
                ))}
                {item.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">+{item.tags.length - 3}</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Project */}
      <Card className="border-dashed border-2 border-muted">
        <CardContent className="p-8 text-center">
          <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Dodaj nowy projekt</h3>
          <p className="text-muted-foreground mb-4">
            Pokaż swoje najlepsze prace i przyciągnij więcej klientów
          </p>
          <Button>
            <Award className="w-4 h-4 mr-2" />
            Dodaj projekt
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}