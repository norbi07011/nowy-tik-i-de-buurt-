import { useState } from "react"
import { useKV } from "@/hooks/use-local-storage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PhotoIcon, StarIcon, ShareIcon, EyeIcon, PlusIcon, MapPinIcon, PhoneIcon, MagnifyingGlassIcon, ChatBubbleLeftIcon, EnvelopeIcon, UserIcon } from "@heroicons/react/24/outline"
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid"

type Photo = {
  id: string
  title: string
  author: string
  category: string
  views: number
  likes: number
  description: string
  imageUrl: string
  uploadDate: string
  featured: boolean
  location: string
  businessPhone?: string
  businessEmail?: string
  city: string
  province: string
  liked: boolean
}

// No demo data - photos will be loaded from Supabase
const samplePhotos: Photo[] = []

const removedSampleData = [
  {
    id: "1",
    title: "Amsterdam Grachten bij Zonsondergang",
    author: "Pieter van der Berg",
    category: "Architectuur",
    views: 3250,
    likes: 189,
    description: "Prachtige zonsondergang over de historische grachten van Amsterdam centrum. Fotografeerd vanaf de Magere Brug.",
    imageUrl: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=300&fit=crop",
    uploadDate: "2024-01-15",
    featured: true,
    location: "Magere Brug, 1018 EG Amsterdam",
    businessPhone: "+31 20 123 4567",
    businessEmail: "pieter@amsterdamfoto.nl",
    city: "Amsterdam",
    province: "Noord-Holland",
    liked: false
  },
  {
    id: "2", 
    title: "Rotterdam Skyline Moderne Architectuur",
    author: "Sarah de Vries",
    category: "Urban",
    views: 2892,
    likes: 167,
    description: "De imposante skyline van Rotterdam met zijn futuristische gebouwen. Gefotografeerd vanaf de Erasmusbrug.",
    imageUrl: "https://images.unsplash.com/photo-1549834125-82d3c48159a3?w=400&h=300&fit=crop",
    uploadDate: "2024-01-12",
    featured: true,
    location: "Erasmusbrug, 3011 BN Rotterdam",
    businessPhone: "+31 10 456 7890",
    businessEmail: "sarah@rotterdamphoto.nl",
    city: "Rotterdam",
    province: "Zuid-Holland",
    liked: true
  },
  {
    id: "3",
    title: "Den Haag Binnenhof Politiek Centrum",
    author: "Marcus Jonker",
    category: "Geschiedenis",
    views: 2103,
    likes: 134,
    description: "Het historische Binnenhof in Den Haag, het politieke hart van Nederland. Klassieke Nederlandse architectuur.",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    uploadDate: "2024-01-10",
    featured: false,
    location: "Binnenhof 8a, 2513 AA Den Haag",
    businessPhone: "+31 70 789 0123",
    businessEmail: "marcus@haagsfoto.nl",
    city: "Den Haag",
    province: "Zuid-Holland",
    liked: false
  },
  {
    id: "4",
    title: "Utrecht Dom Tower Gotische Kunst",
    author: "Emma Visser",
    category: "Architectuur",
    views: 1756,
    likes: 89,
    description: "De majestueuze Domtoren van Utrecht, een meesterwerk van gotische architectuur en het symbool van de stad.",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
    uploadDate: "2024-01-08",
    featured: false,
    location: "Domplein 29, 3512 JE Utrecht",
    businessPhone: "+31 30 234 5678",
    businessEmail: "emma@utrechtfoto.nl",
    city: "Utrecht",
    province: "Utrecht",
    liked: true
  },
  {
    id: "5",
    title: "Keukenhof Tulpen Velden",
    author: "Jan Bakker",
    category: "Natuur",
    views: 4578,
    likes: 312,
    description: "Kleurrijke tulpenvelden in de beroemde Keukenhof. De Nederlandse lente in al zijn pracht en praal.",
    imageUrl: "https://images.unsplash.com/photo-1520637836862-4d197d17c7a4?w=400&h=300&fit=crop",
    uploadDate: "2024-04-05",
    featured: true,
    location: "Stationsweg 166A, 2161 AM Lisse",
    businessPhone: "+31 252 465 555",
    businessEmail: "jan@tulipfoto.nl",
    city: "Lisse",
    province: "Zuid-Holland",
    liked: false
  },
  {
    id: "6",
    title: "Eindhoven Philips Museum Tech Heritage",
    author: "Lisa Hendriks",
    category: "Technologie",
    views: 1634,
    likes: 78,
    description: "Het Philips Museum in Eindhoven, waar technologie en historie samenkomen in het hart van Brainport.",
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    uploadDate: "2024-01-03",
    featured: false,
    location: "Emmasingel 31, 5611 AZ Eindhoven",
    businessPhone: "+31 40 567 8901",
    businessEmail: "lisa@eindhovenfoto.nl",
    city: "Eindhoven",
    province: "Noord-Brabant",
    liked: true
  },
  {
    id: "7",
    title: "Giethoorn Venetië van het Noorden",
    author: "Tom Mulder",
    category: "Natuur",
    views: 2891,
    likes: 203,
    description: "Het idyllische Giethoorn, bekend als het Venetië van het Noorden. Rust en schoonheid van het Nederlandse platteland.",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    uploadDate: "2024-03-20",
    featured: true,
    location: "Binnenpad 168, 8355 BP Giethoorn",
    businessPhone: "+31 521 362 248",
    businessEmail: "tom@giethoornfoto.nl",
    city: "Giethoorn",
    province: "Overijssel",
    liked: false
  },
  {
    id: "8",
    title: "Groningen Martini Tower Student Leven",
    author: "Anna Scholten",
    category: "Cultuur",
    views: 1789,
    likes: 95,
    description: "De Martinitoren in Groningen en het levendige studentenleven in de stad. Jong en dynamisch Nederland.",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop",
    uploadDate: "2024-02-14",
    featured: false,
    location: "Grote Markt 1, 9712 HN Groningen",
    businessPhone: "+31 50 345 6789",
    businessEmail: "anna@groningenfoto.nl",
    city: "Groningen",
    province: "Groningen",
    liked: false
  }
]

export function PhotosView() {
  const [photos, setPhotos] = useKV<Photo[]>("photos-data", samplePhotos)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedProvince, setSelectedProvince] = useState("all")

  const categories = ["all", "Architectuur", "Urban", "Geschiedenis", "Natuur", "Technologie", "Cultuur"]
  const provinces = ["all", "Noord-Holland", "Zuid-Holland", "Utrecht", "Noord-Brabant", "Overijssel", "Groningen"]

  const filteredPhotos = (photos || []).filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || photo.category === selectedCategory
    const matchesProvince = selectedProvince === "all" || photo.province === selectedProvince
    
    return matchesSearch && matchesCategory && matchesProvince
  })

  const toggleLike = (photoId: string) => {
    setPhotos((currentPhotos = []) =>
      currentPhotos.map(photo =>
        photo.id === photoId ? { ...photo, liked: !photo.liked } : photo
      )
    )
  }

  const handleContactBusiness = (photoId: string, type: 'profile' | 'message' | 'email' | 'whatsapp') => {
    const photo = photos?.find(p => p.id === photoId)
    if (!photo) return

    switch (type) {
      case 'profile':
        // Navigate to business profile
        window.open(`/business/${photo.id}`, '_blank')
        break
      case 'message':
        // Open messaging interface
        window.open(`/message/${photo.id}`, '_blank')
        break
      case 'email':
        if (photo.businessEmail) {
          window.open(`mailto:${photo.businessEmail}?subject=Interesse in foto "${photo.title}"`)
        }
        break
      case 'whatsapp':
        if (photo.businessPhone) {
          const phone = photo.businessPhone.replace(/[^0-9]/g, '')
          window.open(`https://wa.me/${phone}?text=Hallo! Ik heb interesse in jullie foto "${photo.title}".`)
        }
        break
    }
  }

  const featuredPhotos = filteredPhotos.filter(photo => photo.featured)
  const regularPhotos = filteredPhotos.filter(photo => !photo.featured)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Foto's & Galerij</h1>
          <p className="text-muted-foreground">Ontdek de mooiste plekken en verhalen uit heel Nederland</p>
        </div>
        <Button>
          <PlusIcon className="w-4 h-4 mr-2" />
          Upload Foto
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Zoek foto's, locaties, fotografen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === "all" ? "Alle categorieën" : cat}
            </option>
          ))}
        </select>
        <select 
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background"
        >
          {provinces.map(prov => (
            <option key={prov} value={prov}>
              {prov === "all" ? "Alle provincies" : prov}
            </option>
          ))}
        </select>
      </div>

      <Tabs defaultValue="featured" className="space-y-6">
        <TabsList>
          <TabsTrigger value="featured">Uitgelichte Foto's ({featuredPhotos.length})</TabsTrigger>
          <TabsTrigger value="all">Alle Foto's ({filteredPhotos.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="space-y-6">
          {featuredPhotos.length === 0 ? (
            <Card className="p-12 text-center">
              <CardContent>
                <PhotoIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Geen uitgelichte foto's gevonden</h3>
                <p className="text-muted-foreground">Probeer je zoekopdracht aan te passen of andere filters te gebruiken.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {featuredPhotos.map((photo) => (
                <PhotoCard 
                  key={photo.id} 
                  photo={photo} 
                  onToggleLike={() => toggleLike(photo.id)}
                  onContactBusiness={handleContactBusiness}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          {filteredPhotos.length === 0 ? (
            <Card className="p-12 text-center">
              <CardContent>
                <MagnifyingGlassIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Geen foto's gevonden</h3>
                <p className="text-muted-foreground">Probeer je zoekopdracht aan te passen of andere filters te gebruiken.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {filteredPhotos.map((photo) => (
                <PhotoCard 
                  key={photo.id} 
                  photo={photo} 
                  onToggleLike={() => toggleLike(photo.id)}
                  onContactBusiness={handleContactBusiness}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Totaal Weergaven</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((photos || []).reduce((sum, photo) => sum + photo.views, 0) || 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">+15% deze maand</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Totaal Likes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(photos || []).reduce((sum, photo) => sum + photo.likes, 0)}
                </div>
                <p className="text-xs text-muted-foreground">+11% deze maand</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Gemiddelde Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(Math.round((photos || []).reduce((sum, photo) => sum + photo.views, 0) / (photos?.length || 1)) || 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">per foto</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Actieve Foto's</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{photos?.length || 0}</div>
                <p className="text-xs text-muted-foreground">{featuredPhotos.length} uitgelicht</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PhotoCard({ photo, onToggleLike, onContactBusiness }: { 
  photo: Photo, 
  onToggleLike: () => void,
  onContactBusiness: (photoId: string, type: 'profile' | 'message' | 'email' | 'whatsapp') => void
}) {
  return (
    <Card className="break-inside-avoid group overflow-hidden hover:shadow-lg transition-all duration-300 mb-6">
      <div className="relative">
        <img 
          src={photo.imageUrl} 
          alt={photo.title}
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={onToggleLike}
          >
            {photo.liked ? (
              <StarSolidIcon className="w-4 h-4 text-yellow-500" />
            ) : (
              <StarIcon className="w-4 h-4" />
            )}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ShareIcon className="w-4 h-4" />
          </Button>
        </div>
        {photo.featured && (
          <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
            Uitgelicht
          </Badge>
        )}
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button size="sm" className="w-full bg-primary/90 hover:bg-primary">
            <EyeIcon className="w-4 h-4 mr-2" />
            Volledig bekijken
          </Button>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-2">{photo.title}</CardTitle>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>door {photo.author}</span>
          <Badge variant="outline" className="text-xs">{photo.category}</Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPinIcon className="w-3 h-3" />
          <span>{photo.city}, {photo.province}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        <CardDescription className="line-clamp-2 text-sm">
          {photo.description}
        </CardDescription>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <div>{photo.location}</div>
          {photo.businessPhone && (
            <div className="flex items-center gap-1">
              <PhoneIcon className="w-3 h-3" />
              {photo.businessPhone}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <EyeIcon className="w-4 h-4" />
              <span>{(photo.views || 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <StarIcon className="w-4 h-4" />
              <span>{photo.likes + (photo.liked ? 1 : 0)}</span>
            </div>
          </div>
          <span>{new Date(photo.uploadDate).toLocaleDateString('nl-NL')}</span>
        </div>

        {/* Contact buttons */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onContactBusiness(photo.id, 'message')}
            className="flex-1"
          >
            <ChatBubbleLeftIcon className="w-4 h-4 mr-1" />
            Bericht
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onContactBusiness(photo.id, 'profile')}
          >
            <UserIcon className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onContactBusiness(photo.id, 'email')}
          >
            <EnvelopeIcon className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}