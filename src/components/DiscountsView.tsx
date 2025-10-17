import { useState } from "react"
import { useKV } from "@github/spark/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TagIcon, ClockIcon, StarIcon, ShoppingCartIcon, PlusIcon, MapPinIcon, PhoneIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"

type Discount = {
  id: string
  title: string
  business: string
  originalPrice: number
  discountedPrice: number
  discountPercentage: number
  category: string
  description: string
  imageUrl: string
  validUntil: string
  location: string
  businessPhone?: string
  businessEmail?: string
  city: string
  province: string
  rating: number
  reviews: number
  featured: boolean
}

const sampleDiscounts: Discount[] = [
  {
    id: "1",
    title: "Hollandse Nieuwe Haring Proeverij",
    business: "De Haringkoning Amsterdam",
    originalPrice: 25,
    discountedPrice: 15,
    discountPercentage: 40,
    category: "Gastronomie",
    description: "Traditionele Nederlandse haringproeverij met 3 verschillende bereidingen en Hollandse uitjes.",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
    validUntil: "2024-03-15",
    location: "Nieuwmarkt 4, 1012 CR Amsterdam",
    businessPhone: "+31 20 625 7890",
    businessEmail: "info@haringkoning.nl",
    city: "Amsterdam",
    province: "Noord-Holland",
    rating: 4.8,
    reviews: 156,
    featured: true
  },
  {
    id: "2",
    title: "Traditionele Nederlandse Massage",
    business: "Wellness Centrum Rotterdam",
    originalPrice: 85,
    discountedPrice: 50,
    discountPercentage: 41,
    category: "Wellness",
    description: "60 minuten ontspannende massage met Nederlandse kruidenoliën. Inclusief gebruik van sauna.",
    imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
    validUntil: "2024-02-28",
    location: "Coolsingel 123, 3012 AC Rotterdam",
    businessPhone: "+31 10 414 5678",
    businessEmail: "wellness@rotterdamcentrum.nl",
    city: "Rotterdam", 
    province: "Zuid-Holland",
    rating: 4.6,
    reviews: 89,
    featured: false
  },
  {
    id: "3",
    title: "Nederlandse Kaasdegustatie Workshop",
    business: "Kaaswinkel Van der Berg",
    originalPrice: 45,
    discountedPrice: 28,
    discountPercentage: 38,
    category: "Cultuur",
    description: "Proef 8 verschillende Nederlandse kazen met wijn pairing. Leer alles over Goudse en Edammer kaas.",
    imageUrl: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&h=300&fit=crop",
    validUntil: "2024-03-01",
    location: "Markt 15, 2611 GS Delft",
    businessPhone: "+31 15 212 3456",
    businessEmail: "info@kaaswinkeldelft.nl",
    city: "Delft",
    province: "Zuid-Holland",
    rating: 4.9,
    reviews: 234,
    featured: true
  },
  {
    id: "4",
    title: "Fietsverhuur + Grachtenroute",
    business: "Amsterdam Bike Tours",
    originalPrice: 35,
    discountedPrice: 22,
    discountPercentage: 37,
    category: "Toerisme",
    description: "Dagverhuur van traditionele Nederlandse fiets + gedetailleerde grachtenroute kaart.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    validUntil: "2024-04-15",
    location: "Damrak 70, 1012 LM Amsterdam",
    businessPhone: "+31 20 320 1234",
    businessEmail: "verhuur@amsterdambikes.nl",
    city: "Amsterdam",
    province: "Noord-Holland",
    rating: 4.5,
    reviews: 178,
    featured: false
  },
  {
    id: "5",
    title: "Stroopwafel Bakworkshop",
    business: "Bakkerij Traditioneel Utrecht",
    originalPrice: 55,
    discountedPrice: 35,
    discountPercentage: 36,
    category: "Workshop",
    description: "Leer zelf authentieke stroopwafels maken volgens oud-Hollands recept. Inclusief alle ingrediënten.",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
    validUntil: "2024-03-10",
    location: "Oudegracht 158, 3511 AX Utrecht",
    businessPhone: "+31 30 231 5678",
    businessEmail: "workshop@bakkerijutrecht.nl",
    city: "Utrecht",
    province: "Utrecht",
    rating: 4.7,
    reviews: 92,
    featured: true
  },
  {
    id: "6",
    title: "Nederlandse Tuin Ontwerp Advies",
    business: "Groenleven Den Haag",
    originalPrice: 120,
    discountedPrice: 75,
    discountPercentage: 38,
    category: "Tuin & Huis",
    description: "Professioneel advies voor Nederlandse tuinontwerp. 2 uur persoonlijk consult + tuinplan.",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
    validUntil: "2024-02-25",
    location: "Lange Voorhout 88, 2514 EJ Den Haag",
    businessPhone: "+31 70 360 7890",
    businessEmail: "advies@groenleven.nl",
    city: "Den Haag",
    province: "Zuid-Holland",
    rating: 4.4,
    reviews: 67,
    featured: false
  },
  {
    id: "7",
    title: "Zeeuws Mosselen Diner",
    business: "Restaurant De Zeeuwse Kust",
    originalPrice: 75,
    discountedPrice: 47,
    discountPercentage: 37,
    category: "Gastronomie",
    description: "All-you-can-eat Zeeuwse mosselen met friet en mayonaise. Traditioneel Nederlands zeevruchten diner.",
    imageUrl: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=300&fit=crop",
    validUntil: "2024-02-20",
    location: "Boulevard de Ruyter 22, 4357 AC Domburg",
    businessPhone: "+31 118 581 234",
    businessEmail: "reserveren@zeeuwsekust.nl",
    city: "Domburg",
    province: "Zeeland",
    rating: 4.6,
    reviews: 143,
    featured: false
  },
  {
    id: "8",
    title: "Technologie Museum Workshop",
    business: "NEMO Science Museum",
    originalPrice: 32,
    discountedPrice: 20,
    discountPercentage: 38,
    category: "Educatie",
    description: "Interactieve workshop over Nederlandse innovaties. Voor families met kinderen 8-16 jaar.",
    imageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop",
    validUntil: "2024-03-30",
    location: "Oosterdok 2, 1011 VX Amsterdam",
    businessPhone: "+31 20 531 3233",
    businessEmail: "workshops@nemoscience.nl",
    city: "Amsterdam",
    province: "Noord-Holland",
    rating: 4.8,
    reviews: 201,
    featured: true
  }
]

export function DiscountsView() {
  const [discounts, setDiscounts] = useKV<Discount[]>("discounts-data", sampleDiscounts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedProvince, setSelectedProvince] = useState("all")
  const [minDiscount, setMinDiscount] = useState(35)

  const categories = ["all", "Gastronomie", "Wellness", "Cultuur", "Toerisme", "Workshop", "Tuin & Huis", "Educatie"]
  const provinces = ["all", "Noord-Holland", "Zuid-Holland", "Utrecht", "Zeeland"]

  const filteredDiscounts = (discounts || []).filter(discount => {
    const matchesSearch = discount.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discount.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discount.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discount.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || discount.category === selectedCategory
    const matchesProvince = selectedProvince === "all" || discount.province === selectedProvince
    const matchesDiscount = discount.discountPercentage >= minDiscount
    return matchesSearch && matchesCategory && matchesProvince && matchesDiscount
  })

  const sortedDiscounts = filteredDiscounts.sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return b.discountPercentage - a.discountPercentage
  })

  const featuredDiscounts = sortedDiscounts.filter(discount => discount.featured)

  const isExpiringSoon = (validUntil: string) => {
    const today = new Date()
    const expiry = new Date(validUntil)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 3
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Kortingen & Aanbiedingen</h1>
          <p className="text-muted-foreground">De beste Nederlandse deals en aanbiedingen -35% of meer</p>
        </div>
        <Button>
          <PlusIcon className="w-4 h-4 mr-2" />
          Nieuwe Korting
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Zoek kortingen, bedrijven, steden..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Min. korting:</label>
            <select 
              value={minDiscount} 
              onChange={(e) => setMinDiscount(Number(e.target.value))}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value={35}>35%</option>
              <option value={40}>40%</option>
              <option value={50}>50%</option>
            </select>
          </div>
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
          <TabsTrigger value="featured">Aanbevolen Deals ({featuredDiscounts.length})</TabsTrigger>
          <TabsTrigger value="all">Alle Kortingen ({sortedDiscounts.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="space-y-6">
          {featuredDiscounts.length === 0 ? (
            <Card className="p-12 text-center">
              <CardContent>
                <TagIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Geen aanbevolen deals gevonden</h3>
                <p className="text-muted-foreground">Probeer je zoekopdracht aan te passen of andere filters te gebruiken.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDiscounts.map((discount) => (
                <DiscountCard key={discount.id} discount={discount} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          {sortedDiscounts.length === 0 ? (
            <Card className="p-12 text-center">
              <CardContent>
                <MagnifyingGlassIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Geen kortingen gevonden</h3>
                <p className="text-muted-foreground">Probeer je zoekopdracht aan te passen of andere filters te gebruiken.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedDiscounts.map((discount) => (
                <DiscountCard key={discount.id} discount={discount} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Totaal Kortingen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{discounts?.length || 0}</div>
                <p className="text-xs text-muted-foreground">{featuredDiscounts.length} aanbevolen</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Gem. Korting</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((discounts || []).reduce((sum, d) => sum + d.discountPercentage, 0) / (discounts?.length || 1))}%
                </div>
                <p className="text-xs text-muted-foreground">gemiddelde korting</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Totale Besparing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  €{(discounts || []).reduce((sum, d) => sum + (d.originalPrice - d.discountedPrice), 0)}
                </div>
                <p className="text-xs text-muted-foreground">mogelijke besparing</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Gem. Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((discounts || []).reduce((sum, d) => sum + d.rating, 0) / (discounts?.length || 1)).toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">5.0 sterren</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DiscountCard({ discount }: { discount: Discount }) {
  const isExpiringSoon = (validUntil: string) => {
    const today = new Date()
    const expiry = new Date(validUntil)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 3
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 relative">
      {discount.featured && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
            Aanbevolen
          </Badge>
        </div>
      )}
      
      {isExpiringSoon(discount.validUntil) && (
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="destructive" className="animate-pulse">
            Eindigt Snel!
          </Badge>
        </div>
      )}

      <div className="relative">
        <img 
          src={discount.imageUrl} 
          alt={discount.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 text-white">
          <div className="text-2xl font-bold">-{discount.discountPercentage}%</div>
        </div>
        <div className="absolute bottom-3 right-3">
          <Button size="sm" className="bg-primary/90 hover:bg-primary">
            <ShoppingCartIcon className="w-4 h-4 mr-2" />
            Bekijk Deal
          </Button>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-1">{discount.title}</CardTitle>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="font-medium">{discount.business}</span>
          <div className="flex items-center gap-1">
            <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{discount.rating}</span>
            <span>({discount.reviews})</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPinIcon className="w-3 h-3" />
          <span>{discount.city}, {discount.province}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        <CardDescription className="line-clamp-2 text-sm">
          {discount.description}
        </CardDescription>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <div>{discount.location}</div>
          {discount.businessPhone && (
            <div className="flex items-center gap-1">
              <PhoneIcon className="w-3 h-3" />
              {discount.businessPhone}
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">
                  €{discount.discountedPrice}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  €{discount.originalPrice}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Bespaar: €{discount.originalPrice - discount.discountedPrice}
              </div>
            </div>
            <Badge variant="outline" className="text-xs">{discount.category}</Badge>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <ClockIcon className="w-3 h-3" />
              <span>geldig t/m {new Date(discount.validUntil).toLocaleDateString('nl-NL')}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}