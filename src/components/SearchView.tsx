import { useState, useEffect } from "react"
import { useKV } from "@/hooks/use-local-storage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from "@/hooks/use-translation"
import { toast } from "sonner"
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  PhoneIcon,
  StarIcon,
  ShareIcon,
  BuildingStorefrontIcon,
  UserIcon,
  PhotoIcon,
  PlayIcon,
  TagIcon,
  BookmarkIcon,
  ChatBubbleLeftIcon,
  EnvelopeIcon
} from "@heroicons/react/24/outline"
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid"

interface SearchResult {
  id: string
  type: 'business' | 'post' | 'photo' | 'video' | 'discount' | 'user'
  title: string
  description: string
  imageUrl?: string
  location: string
  city: string
  province: string
  category: string
  rating?: number
  reviews?: number
  businessName?: string
  price?: number
  discountPrice?: number
  discountPercentage?: number
  tags: string[]
  featured: boolean
  phone?: string
  email?: string
  liked: boolean
  saved: boolean
}

export function SearchView() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchHistory, setSearchHistory] = useKV<string[]>("search-history", [])
  const [favorites, setFavorites] = useKV<string[]>("search-favorites", [])

  // No mock data - will load from API/Supabase
  const mockResults: SearchResult[] = []

  const categories = ["all", "Restaurant", "Verhuur", "Fotografie", "Natuur", "Wellness", "Technologie"]
  const locations = ["all", "Amsterdam", "Rotterdam", "Utrecht", "Den Haag", "Lisse"]
  const types = ["all", "business", "discount", "photo", "video", "post"]

  const performSearch = async () => {
    if (!searchTerm.trim()) return

    setIsSearching(true)
    
    // Add to search history
    if (searchTerm.trim() && !searchHistory?.includes(searchTerm.trim())) {
      const newHistory = [searchTerm.trim(), ...(searchHistory || [])].slice(0, 10)
      setSearchHistory(newHistory)
    }

    try {
      // Simulate API search delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Load real results from Supabase in the future
      const filteredResults = mockResults.filter(result => {
        const matchesSearch = result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             result.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             result.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             result.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             result.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        
        const matchesCategory = selectedCategory === "all" || result.category === selectedCategory
        const matchesLocation = selectedLocation === "all" || result.city === selectedLocation  
        const matchesType = selectedType === "all" || result.type === selectedType
        
        return matchesSearch && matchesCategory && matchesLocation && matchesType
      })

      setResults(filteredResults)
    } catch (error) {
      toast.error("Search failed. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  const toggleLike = (resultId: string) => {
    setResults(current => 
      current.map(result => 
        result.id === resultId ? { ...result, liked: !result.liked } : result
      )
    )
    toast.success("Updated!")
  }

  const toggleSave = (resultId: string) => {
    setResults(current => 
      current.map(result => 
        result.id === resultId ? { ...result, saved: !result.saved } : result
      )
    )
    toast.success("Saved!")
  }

  const addToFavorites = (term: string) => {
    if (!favorites?.includes(term)) {
      setFavorites([...(favorites || []), term])
      toast.success("Added to favorite searches!")
    }
  }

  const handleContactBusiness = (resultId: string, type: 'profile' | 'message' | 'email' | 'whatsapp') => {
    const result = results.find(r => r.id === resultId)
    if (!result) return

    switch (type) {
      case 'profile':
        window.open(`/business/${result.id}`, '_blank')
        break
      case 'message':
        window.open(`/message/${result.id}`, '_blank')
        break
      case 'email':
        if (result.email) {
          window.open(`mailto:${result.email}?subject=Interesse in ${result.title}`)
        }
        break
      case 'whatsapp':
        if (result.phone) {
          const phone = result.phone.replace(/[^0-9]/g, '')
          window.open(`https://wa.me/${phone}?text=Hallo! Ik heb interesse in "${result.title}".`)
        }
        break
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'business': return <BuildingStorefrontIcon className="w-4 h-4" />
      case 'discount': return <TagIcon className="w-4 h-4" />
      case 'photo': return <PhotoIcon className="w-4 h-4" />
      case 'video': return <PlayIcon className="w-4 h-4" />
      case 'user': return <UserIcon className="w-4 h-4" />
      default: return <MagnifyingGlassIcon className="w-4 h-4" />
    }
  }

  useEffect(() => {
    if (searchTerm.trim()) {
      const debounceTimer = setTimeout(() => {
        performSearch()
      }, 500)
      return () => clearTimeout(debounceTimer)
    } else {
      setResults([])
    }
  }, [searchTerm, selectedCategory, selectedLocation, selectedType])

  return (
    <div className="h-screen bg-background overflow-y-auto">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <MagnifyingGlassIcon className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">{t("search")}</h1>
          </div>

          {/* Main Search */}
          <div className="space-y-3">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Zoek bedrijven, aanbiedingen, foto's..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-4 py-3 text-base"
                onKeyPress={(e) => e.key === "Enter" && performSearch()}
              />
              {searchTerm && (
                <Button
                  size="sm" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7"
                  onClick={performSearch}
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Zoek"
                  )}
                </Button>
              )}
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background text-sm"
              >
                <option value="all">Alle typen</option>
                <option value="business">Bedrijven</option>
                <option value="discount">Kortingen</option>
                <option value="photo">Foto's</option>
                <option value="video">Video's</option>
              </select>
              
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
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background text-sm"
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>
                    {loc === "all" ? "Alle locaties" : loc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 pb-20">
        <Tabs defaultValue="results" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="results">
              Resultaten ({results.length})
            </TabsTrigger>
            <TabsTrigger value="history">
              Geschiedenis ({searchHistory?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="favorites">
              Favorieten ({favorites?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-4">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-muted-foreground">Zoeken...</p>
              </div>
            ) : results.length === 0 && searchTerm ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MagnifyingGlassIcon className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">Geen resultaten gevonden</h3>
                <p className="text-muted-foreground text-sm">
                  Probeer andere zoektermen of pas je filters aan
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MagnifyingGlassIcon className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">Begin met zoeken</h3>
                <p className="text-muted-foreground text-sm">
                  Zoek naar bedrijven, aanbiedingen, foto's en meer
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((result) => (
                  <SearchResultCard 
                    key={result.id} 
                    result={result} 
                    onLike={() => toggleLike(result.id)}
                    onSave={() => toggleSave(result.id)}
                    onContactBusiness={handleContactBusiness}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {searchHistory?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Geen zoekgeschiedenis</p>
              </div>
            ) : (
              <div className="space-y-2">
                {searchHistory?.map((term, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSearchTerm(term)}>
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MagnifyingGlassIcon className="w-4 h-4 text-muted-foreground" />
                        <span>{term}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          addToFavorites(term)
                        }}
                      >
                        <StarIcon className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            {favorites?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Geen favoriete zoekopdrachten</p>
              </div>
            ) : (
              <div className="space-y-2">
                {favorites?.map((term, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSearchTerm(term)}>
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <StarSolidIcon className="w-4 h-4 text-yellow-500" />
                        <span>{term}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setFavorites(favorites?.filter(f => f !== term) || [])
                        }}
                      >
                        Remove
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function SearchResultCard({ 
  result, 
  onLike, 
  onSave,
  onContactBusiness
}: { 
  result: SearchResult
  onLike: () => void
  onSave: () => void
  onContactBusiness: (resultId: string, type: 'profile' | 'message' | 'email' | 'whatsapp') => void
}) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'business': return <BuildingStorefrontIcon className="w-4 h-4" />
      case 'discount': return <TagIcon className="w-4 h-4" />
      case 'photo': return <PhotoIcon className="w-4 h-4" />
      case 'video': return <PlayIcon className="w-4 h-4" />
      case 'user': return <UserIcon className="w-4 h-4" />
      default: return <MagnifyingGlassIcon className="w-4 h-4" />
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {result.imageUrl && (
            <img 
              src={result.imageUrl} 
              alt={result.title}
              className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
            />
          )}
          
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getTypeIcon(result.type)}
                  <h3 className="font-semibold text-lg">{result.title}</h3>
                  {result.featured && (
                    <Badge className="bg-accent text-accent-foreground">
                      Aanbevolen
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {result.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPinIcon className="w-3 h-3" />
              <span>{result.city}, {result.province}</span>
              {result.rating && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <StarIcon className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{result.rating}</span>
                    {result.reviews && <span>({result.reviews})</span>}
                  </div>
                </>
              )}
            </div>

            {result.discountPrice && (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">€{result.discountPrice}</span>
                <span className="text-sm text-muted-foreground line-through">€{result.price}</span>
                <Badge variant="destructive" className="text-xs">
                  -{result.discountPercentage}%
                </Badge>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {result.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLike}
                  className="p-2"
                >
                  {result.liked ? (
                    <StarSolidIcon className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <StarIcon className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSave}
                  className="p-2"
                >
                  <BookmarkIcon className={`w-4 h-4 ${result.saved ? 'fill-current text-warning' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onContactBusiness(result.id, 'message')}
                  className="p-2"
                >
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onContactBusiness(result.id, 'profile')}
                  className="p-2"
                >
                  <UserIcon className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <ShareIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}