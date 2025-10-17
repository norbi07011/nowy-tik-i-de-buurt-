import { useState } from "react"
import { useKV } from "@/hooks/use-local-storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, Upload, Trash2, Edit, Eye, Share2, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface GalleryItem {
  id: string
  url: string
  title: string
  description: string
  category: string
  tags: string[]
  uploadDate: string
  views: number
}

export function BusinessGallery() {
  const [galleryItems, setGalleryItems] = useKV<GalleryItem[]>("business-gallery", [
    {
      id: "1",
      url: "/api/placeholder/400/300",
      title: "Przykładowe zdjęcie 1",
      description: "Opis pierwszego zdjęcia",
      category: "Realizacje",
      tags: ["projekt", "premium"],
      uploadDate: "2024-01-15",
      views: 234
    },
    {
      id: "2", 
      url: "/api/placeholder/400/300",
      title: "Przykładowe zdjęcie 2",
      description: "Opis drugiego zdjęcia",
      category: "Usługi",
      tags: ["profesjonalne", "jakość"],
      uploadDate: "2024-01-10",
      views: 189
    }
  ])

  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isUploading, setIsUploading] = useState(false)

  const categories = ["all", "Realizacje", "Usługi", "Zespół", "Wyposażenie", "Certyfikaty"]

  const filteredItems = selectedCategory === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory)

  const handleUpload = () => {
    setIsUploading(true)
    // Simulate upload
    setTimeout(() => {
      const newItem: GalleryItem = {
        id: Date.now().toString(),
        url: "/api/placeholder/400/300",
        title: "Nowe zdjęcie",
        description: "Opis nowego zdjęcia",
        category: "Realizacje",
        tags: ["nowe"],
        uploadDate: new Date().toISOString().split('T')[0],
        views: 0
      }
      setGalleryItems(prev => [newItem, ...prev])
      setIsUploading(false)
    }, 2000)
  }

  const deleteItem = (id: string) => {
    setGalleryItems(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Galeria zdjęć</h2>
          <p className="text-muted-foreground">Zarządzaj zdjęciami swojej firmy</p>
        </div>
        <Button onClick={handleUpload} disabled={isUploading}>
          {isUploading ? (
            <>Przesyłanie...</>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Dodaj zdjęcia
            </>
          )}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{galleryItems.length}</div>
            <div className="text-sm text-muted-foreground">Zdjęć</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {galleryItems.reduce((sum, item) => sum + item.views, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Wyświetleń</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {[...new Set(galleryItems.flatMap(item => item.tags))].length}
            </div>
            <div className="text-sm text-muted-foreground">Tagów</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {[...new Set(galleryItems.map(item => item.category))].length}
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

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <Card key={item.id} className="overflow-hidden group">
            <div className="relative">
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-48 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="secondary">
                      <Eye className="w-4 h-4 mr-1" />
                      Podgląd
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>{item.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <img src={item.url} alt={item.title} className="w-full rounded-lg" />
                      <div>
                        <p className="text-muted-foreground">{item.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.tags.map(tag => (
                            <Badge key={tag} variant="outline">#{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button size="sm" variant="secondary">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => deleteItem(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="absolute top-2 right-2">
                <Badge variant="secondary">{item.category}</Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {item.views}
                </div>
                <span>{item.uploadDate}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
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

      {/* Upload Area */}
      <Card className="border-dashed border-2 border-muted">
        <CardContent className="p-8 text-center">
          <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Dodaj więcej zdjęć</h3>
          <p className="text-muted-foreground mb-4">
            Przeciągnij i upuść pliki lub kliknij, aby wybrać
          </p>
          <Button onClick={handleUpload} disabled={isUploading}>
            <Plus className="w-4 h-4 mr-2" />
            Wybierz pliki
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}