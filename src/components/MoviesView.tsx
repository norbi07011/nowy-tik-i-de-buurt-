import { useState } from "react"
import { useKV } from "@/hooks/use-local-storage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlayIcon, StarIcon, ShareIcon, EyeIcon, PlusIcon, MapPinIcon, PhoneIcon, MagnifyingGlassIcon, ChatBubbleLeftIcon, EnvelopeIcon, UserIcon } from "@heroicons/react/24/outline"
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid"

type Movie = {
  id: string
  title: string
  category: string
  year: number
  rating: number
  duration: string
  description: string
  poster: string
  thumbnail: string
  views: number
  likes: number
  featured: boolean
  location: string
  businessPhone?: string
  businessEmail?: string
  city: string
  province: string
  liked: boolean
  language: string
  marketingCategory: string
  targetAudience: string[]
  budget: string
  businessType: string
  tags: string[]
  videoQuality: string
  uploadDate: string
}

const sampleMovies: Movie[] = [
  {
    id: "1",
    title: "Amsterdam Centrum Business Tour",
    category: "Bedrijven",
    year: 2024,
    rating: 4.8,
    duration: "15:32",
    description: "Ontdek de beste lokale bedrijven in het hart van Amsterdam. Van traditionele cafés tot moderne startups.",
    poster: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=300&h=450&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=300&h=200&fit=crop",
    views: 2540,
    likes: 89,
    featured: true,
    location: "Dam Square 1, 1012 NP Amsterdam",
    businessPhone: "+31 20 123 4567",
    businessEmail: "info@amsterdamcentrum.nl",
    city: "Amsterdam",
    province: "Noord-Holland",
    liked: false,
    language: "Nederlands",
    marketingCategory: "Brand Awareness",
    targetAudience: ["Lokale bewoners", "Toeristen", "Ondernemers"],
    budget: "€500-1000",
    businessType: "Dienstverlening",
    tags: ["lokaal", "bedrijven", "amsterdam", "centrum"],
    videoQuality: "4K",
    uploadDate: "2024-01-15"
  },
  {
    id: "2",
    title: "Rotterdam Haven Innovatie",
    category: "Industrie",
    year: 2024,
    rating: 4.6,
    duration: "12:45",
    description: "Showcase van innovatieve bedrijven in Europa's grootste haven. Technologie en traditie hand in hand.",
    poster: "https://images.unsplash.com/photo-1549834125-82d3c48159a3?w=300&h=450&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1549834125-82d3c48159a3?w=300&h=200&fit=crop",
    views: 1850,
    likes: 67,
    featured: false,
    location: "Wilhelminakade 123, 3072 AP Rotterdam",
    businessPhone: "+31 10 456 7890",
    businessEmail: "contact@rotterdamhaven.nl",
    city: "Rotterdam",
    province: "Zuid-Holland",
    liked: true,
    language: "Nederlands",
    marketingCategory: "Lead Generation",
    targetAudience: ["B2B", "Investeerders", "Technologie professionals"],
    budget: "€1000-2500",
    businessType: "Industrie",
    tags: ["haven", "innovatie", "technologie", "logistiek"],
    videoQuality: "4K",
    uploadDate: "2024-01-20"
  },
  {
    id: "3",
    title: "Den Haag Political Center",
    category: "Documentaire",
    year: 2024,
    rating: 4.9,
    duration: "18:20",
    description: "Documentary about the political heart of the Netherlands. See how democracy works in The Hague.",
    poster: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=450&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop",
    views: 3200,
    likes: 156,
    featured: true,
    location: "Binnenhof 1, 2513 AA Den Haag",
    businessPhone: "+31 70 789 0123",
    businessEmail: "info@denhaagcentrum.gov.nl",
    city: "Den Haag",
    province: "Zuid-Holland",
    liked: false,
    language: "English",
    marketingCategory: "Educational Content",
    targetAudience: ["Studenten", "Internationale bezoekers", "Overheid"],
    budget: "€2500-5000",
    businessType: "Overheid",
    tags: ["politiek", "democratie", "geschiedenis", "educatie"],
    videoQuality: "4K",
    uploadDate: "2024-02-01"
  },
  {
    id: "4",
    title: "Utrecht Startup Ökosystem",
    category: "Technologie",
    year: 2024,
    rating: 4.4,
    duration: "9:15",
    description: "Junge Unternehmer und innovative Firmen im Herzen der Niederlande. Die Zukunft beginnt hier.",
    poster: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=450&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop",
    views: 1420,
    likes: 78,
    featured: false,
    location: "Neude 11, 3512 ADC Utrecht",
    businessPhone: "+31 30 234 5678",
    businessEmail: "hello@utrechtstartup.nl",
    city: "Utrecht",
    province: "Utrecht",
    liked: true,
    language: "Deutsch",
    marketingCategory: "Social Media Campaign",
    targetAudience: ["Jonge professionals", "Expats", "Investeerders"],
    budget: "€1000-2500",
    businessType: "Technologie",
    tags: ["startup", "innovatie", "tech", "ondernemerschap"],
    videoQuality: "HD",
    uploadDate: "2024-02-10"
  },
  {
    id: "5",
    title: "Brainport Eindhoven Tech Hub",
    category: "Technologie",
    year: 2024,
    rating: 4.7,
    duration: "14:30",
    description: "High-tech companies and innovation in Brainport Eindhoven. Where smart technology comes to life.",
    poster: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=450&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop",
    views: 2100,
    likes: 94,
    featured: true,
    location: "High Tech Campus 1, 5656 AE Eindhoven",
    businessPhone: "+31 40 567 8901",
    businessEmail: "info@brainhub.nl",
    city: "Eindhoven",
    province: "Noord-Brabant",
    liked: false,
    language: "English",
    marketingCategory: "Product Demo",
    targetAudience: ["Tech professionals", "Internationale bedrijven", "Engineers"],
    budget: "€5000+",
    businessType: "Technologie",
    tags: ["hightech", "AI", "robotics", "innovation"],
    videoQuality: "4K",
    uploadDate: "2024-02-15"
  },
  {
    id: "6",
    title: "Groningen Ville Étudiante",
    category: "Cultuur",
    year: 2024,
    rating: 4.3,
    duration: "11:45",
    description: "La vie étudiante et l'entrepreneuriat jeune dans la vibrante Groningen. Énergie et créativité.",
    poster: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&h=450&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&h=200&fit=crop",
    views: 1680,
    likes: 56,
    featured: false,
    location: "Grote Markt 1, 9712 HN Groningen",
    businessPhone: "+31 50 345 6789",
    businessEmail: "student@groningenuni.nl",
    city: "Groningen",
    province: "Groningen",
    liked: false,
    language: "Français",
    marketingCategory: "Community Building",
    targetAudience: ["Studenten", "Jonge professionals", "Expats"],
    budget: "€250-500",
    businessType: "Educatie",
    tags: ["student", "cultuur", "youth", "community"],
    videoQuality: "HD",
    uploadDate: "2024-02-20"
  },
  {
    id: "7",
    title: "Maastricht Comercio Local",
    category: "Retail",
    year: 2024,
    rating: 4.5,
    duration: "13:15",
    description: "Descubre el comercio local de Maastricht. Tiendas familiares y tradición centenaria.",
    poster: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=450&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop",
    views: 1200,
    likes: 45,
    featured: false,
    location: "Vrijthof 1, 6211 LD Maastricht",
    businessPhone: "+31 43 123 4567",
    businessEmail: "info@maastrichtlocal.nl",
    city: "Maastricht",
    province: "Limburg",
    liked: false,
    language: "Español",
    marketingCategory: "Local SEO",
    targetAudience: ["Lokale bewoners", "Spaanse toeristen", "Expats"],
    budget: "€500-1000",
    businessType: "Retail",
    tags: ["retail", "lokaal", "traditie", "shopping"],
    videoQuality: "HD",
    uploadDate: "2024-02-25"
  },
  {
    id: "8",
    title: "Leeuwarden Innovazione Sostenibile",
    category: "Milieu",
    year: 2024,
    rating: 4.6,
    duration: "16:40",
    description: "Innovazione sostenibile e imprese verdi a Leeuwarden. Il futuro è green.",
    poster: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=450&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=200&fit=crop",
    views: 890,
    likes: 67,
    featured: true,
    location: "Wirdumerdijk 23, 8911 CE Leeuwarden",
    businessPhone: "+31 58 234 5678",
    businessEmail: "green@leeuwarden.nl",
    city: "Leeuwarden",
    province: "Friesland",
    liked: true,
    language: "Italiano",
    marketingCategory: "Sustainability Marketing",
    targetAudience: ["Milieu bewuste consumenten", "B2B", "Overheden"],
    budget: "€1000-2500",
    businessType: "Duurzaamheid",
    tags: ["duurzaam", "groen", "innovatie", "milieu"],
    videoQuality: "4K",
    uploadDate: "2024-03-01"
  }
]

export function MoviesView() {
  const [movies, setMovies] = useKV<Movie[]>("movies-data", sampleMovies)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedProvince, setSelectedProvince] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [selectedMarketingCategory, setSelectedMarketingCategory] = useState("all")
  const [selectedBudgetRange, setSelectedBudgetRange] = useState("all")
  const [selectedVideoQuality, setSelectedVideoQuality] = useState("all")

  const categories = ["all", "Bedrijven", "Industrie", "Documentaire", "Technologie", "Cultuur", "Retail", "Milieu"]
  const provinces = ["all", "Noord-Holland", "Zuid-Holland", "Utrecht", "Noord-Brabant", "Groningen", "Limburg", "Friesland"]
  const languages = ["all", "Nederlands", "English", "Deutsch", "Français", "Español", "Italiano"]
  const marketingCategories = ["all", "Brand Awareness", "Lead Generation", "Educational Content", "Social Media Campaign", "Product Demo", "Community Building", "Local SEO", "Sustainability Marketing"]
  const budgetRanges = ["all", "€250-500", "€500-1000", "€1000-2500", "€2500-5000", "€5000+"]
  const videoQualities = ["all", "HD", "4K"]

  const filteredMovies = (movies || []).filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movie.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movie.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movie.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || movie.category === selectedCategory
    const matchesProvince = selectedProvince === "all" || movie.province === selectedProvince
    const matchesLanguage = selectedLanguage === "all" || movie.language === selectedLanguage
    const matchesMarketingCategory = selectedMarketingCategory === "all" || movie.marketingCategory === selectedMarketingCategory
    const matchesBudget = selectedBudgetRange === "all" || movie.budget === selectedBudgetRange
    const matchesQuality = selectedVideoQuality === "all" || movie.videoQuality === selectedVideoQuality
    
    return matchesSearch && matchesCategory && matchesProvince && matchesLanguage && matchesMarketingCategory && matchesBudget && matchesQuality
  })

  const toggleLike = (movieId: string) => {
    setMovies((currentMovies = []) =>
      currentMovies.map(movie =>
        movie.id === movieId ? { ...movie, liked: !movie.liked } : movie
      )
    )
  }

  const handleContactBusiness = (movieId: string, type: 'profile' | 'message' | 'email' | 'whatsapp') => {
    const movie = movies?.find(m => m.id === movieId)
    if (!movie) return

    switch (type) {
      case 'profile':
        // Navigate to business profile
        window.open(`/business/${movie.id}`, '_blank')
        break
      case 'message':
        // Open messaging interface
        window.open(`/message/${movie.id}`, '_blank')
        break
      case 'email':
        if (movie.businessEmail) {
          window.open(`mailto:${movie.businessEmail}?subject=Interesse in ${movie.title}`)
        }
        break
      case 'whatsapp':
        if (movie.businessPhone) {
          const phone = movie.businessPhone.replace(/[^0-9]/g, '')
          window.open(`https://wa.me/${phone}?text=Hallo! Ik heb interesse in jullie video "${movie.title}".`)
        }
        break
    }
  }

  const featuredMovies = filteredMovies.filter(movie => movie.featured)
  const regularMovies = filteredMovies.filter(movie => !movie.featured)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Films & Video's</h1>
          <p className="text-muted-foreground">Beheer je video content en promotie materialen uit heel Nederland</p>
        </div>
        <Button>
          <PlusIcon className="w-4 h-4 mr-2" />
          Upload Video
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Zoek films, bedrijven, steden, tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm("")
              setSelectedCategory("all")
              setSelectedProvince("all")
              setSelectedLanguage("all")
              setSelectedMarketingCategory("all")
              setSelectedBudgetRange("all")
              setSelectedVideoQuality("all")
            }}
          >
            Reset Filters
          </Button>
        </div>

        {/* Primary Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background text-sm"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === "all" ? "Alle categorieën" : cat}
              </option>
            ))}
          </select>
          
          <select 
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background text-sm"
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>
                {lang === "all" ? "Alle talen" : lang}
              </option>
            ))}
          </select>

          <select 
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background text-sm"
          >
            {provinces.map(prov => (
              <option key={prov} value={prov}>
                {prov === "all" ? "Alle provincies" : prov}
              </option>
            ))}
          </select>

          <select 
            value={selectedVideoQuality}
            onChange={(e) => setSelectedVideoQuality(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background text-sm"
          >
            {videoQualities.map(quality => (
              <option key={quality} value={quality}>
                {quality === "all" ? "Alle kwaliteiten" : quality}
              </option>
            ))}
          </select>
        </div>

        {/* Advanced Marketing Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select 
            value={selectedMarketingCategory}
            onChange={(e) => setSelectedMarketingCategory(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background text-sm"
          >
            {marketingCategories.map(cat => (
              <option key={cat} value={cat}>
                {cat === "all" ? "Alle marketing categorieën" : cat}
              </option>
            ))}
          </select>

          <select 
            value={selectedBudgetRange}
            onChange={(e) => setSelectedBudgetRange(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background text-sm"
          >
            {budgetRanges.map(budget => (
              <option key={budget} value={budget}>
                {budget === "all" ? "Alle budgetbereiken" : budget}
              </option>
            ))}
          </select>
        </div>

        {/* Active filters display */}
        <div className="flex flex-wrap gap-2">
          {selectedCategory !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Categorie: {selectedCategory}
              <button onClick={() => setSelectedCategory("all")} className="ml-1 hover:bg-red-100 rounded-full w-4 h-4 flex items-center justify-center text-xs">×</button>
            </Badge>
          )}
          {selectedLanguage !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Taal: {selectedLanguage}
              <button onClick={() => setSelectedLanguage("all")} className="ml-1 hover:bg-red-100 rounded-full w-4 h-4 flex items-center justify-center text-xs">×</button>
            </Badge>
          )}
          {selectedProvince !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Provincie: {selectedProvince}
              <button onClick={() => setSelectedProvince("all")} className="ml-1 hover:bg-red-100 rounded-full w-4 h-4 flex items-center justify-center text-xs">×</button>
            </Badge>
          )}
          {selectedMarketingCategory !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Marketing: {selectedMarketingCategory}
              <button onClick={() => setSelectedMarketingCategory("all")} className="ml-1 hover:bg-red-100 rounded-full w-4 h-4 flex items-center justify-center text-xs">×</button>
            </Badge>
          )}
          {selectedBudgetRange !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Budget: {selectedBudgetRange}
              <button onClick={() => setSelectedBudgetRange("all")} className="ml-1 hover:bg-red-100 rounded-full w-4 h-4 flex items-center justify-center text-xs">×</button>
            </Badge>
          )}
          {selectedVideoQuality !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Kwaliteit: {selectedVideoQuality}
              <button onClick={() => setSelectedVideoQuality("all")} className="ml-1 hover:bg-red-100 rounded-full w-4 h-4 flex items-center justify-center text-xs">×</button>
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="featured" className="space-y-6">
        <TabsList>
          <TabsTrigger value="featured">Uitgelichte Films ({featuredMovies.length})</TabsTrigger>
          <TabsTrigger value="all">Alle Films ({filteredMovies.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="space-y-6">
          {featuredMovies.length === 0 ? (
            <Card className="p-12 text-center">
              <CardContent>
                <PlayIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Geen uitgelichte films gevonden</h3>
                <p className="text-muted-foreground">Probeer je zoekopdracht aan te passen of andere filters te gebruiken.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredMovies.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onToggleLike={() => toggleLike(movie.id)}
                  onContactBusiness={handleContactBusiness}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          {filteredMovies.length === 0 ? (
            <Card className="p-12 text-center">
              <CardContent>
                <MagnifyingGlassIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Geen films gevonden</h3>
                <p className="text-muted-foreground">Probeer je zoekopdracht aan te passen of andere filters te gebruiken.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onToggleLike={() => toggleLike(movie.id)}
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
                  {((movies || []).reduce((sum, movie) => sum + movie.views, 0) || 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">+12% deze maand</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Totaal Likes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(movies || []).reduce((sum, movie) => sum + movie.likes, 0)}
                </div>
                <p className="text-xs text-muted-foreground">+8% deze maand</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Gemiddelde Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((movies || []).reduce((sum, movie) => sum + movie.rating, 0) / (movies?.length || 1)).toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">5.0 sterren</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Actieve Films</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{movies?.length || 0}</div>
                <p className="text-xs text-muted-foreground">{featuredMovies.length} uitgelicht</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MovieCard({ movie, onToggleLike, onContactBusiness }: { 
  movie: Movie, 
  onToggleLike: () => void,
  onContactBusiness: (movieId: string, type: 'profile' | 'message' | 'email' | 'whatsapp') => void
}) {
  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={movie.thumbnail} 
          alt={movie.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg flex items-center justify-center">
          <Button size="sm" variant="secondary">
            <PlayIcon className="w-4 h-4 mr-1" />
            Afspelen
          </Button>
        </div>
        {movie.featured && (
          <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
            Uitgelicht
          </Badge>
        )}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {movie.duration}
        </div>
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {movie.videoQuality}
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg flex-1">{movie.title}</CardTitle>
          <Badge variant="outline" className="ml-2 text-xs">
            {movie.language}
          </Badge>
        </div>
        <CardDescription>{movie.description}</CardDescription>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPinIcon className="w-3 h-3" />
          <span>{movie.city}, {movie.province}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="text-xs text-muted-foreground space-y-1">
          <div>{movie.location}</div>
          {movie.businessPhone && (
            <div className="flex items-center gap-1">
              <PhoneIcon className="w-3 h-3" />
              {movie.businessPhone}
            </div>
          )}
        </div>

        {/* Marketing Information */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">{movie.marketingCategory}</Badge>
            <Badge variant="outline" className="text-xs">{movie.budget}</Badge>
          </div>
          <div className="flex flex-wrap gap-1">
            {movie.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {movie.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{movie.tags.length - 3}
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            Target: {movie.targetAudience.slice(0, 2).join(", ")}
            {movie.targetAudience.length > 2 && ` +${movie.targetAudience.length - 2}`}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <EyeIcon className="w-4 h-4" />
              {(movie.views || 0).toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <StarIcon className="w-4 h-4" />
              {movie.rating}
            </span>
          </div>
          <Badge variant="secondary">{movie.category}</Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleLike}
            className="gap-1"
          >
            {movie.liked ? (
              <StarSolidIcon className="w-4 h-4 text-yellow-500" />
            ) : (
              <StarIcon className="w-4 h-4" />
            )}
            {movie.likes + (movie.liked ? 1 : 0)}
          </Button>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => onContactBusiness(movie.id, 'message')}>
              <ChatBubbleLeftIcon className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onContactBusiness(movie.id, 'profile')}>
              <UserIcon className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onContactBusiness(movie.id, 'email')}>
              <EnvelopeIcon className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ShareIcon className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}