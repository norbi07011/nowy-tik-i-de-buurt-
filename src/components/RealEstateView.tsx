import { useState } from "react"
import { useKV } from "@/hooks/use-local-storage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HomeIcon, MapPinIcon, CameraIcon, HeartIcon, ShareIcon, PlusIcon, PhoneIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid"

type RealEstate = {
  id: string
  title: string
  type: "koop" | "huur"
  propertyType: string
  price: number
  area: number
  rooms: number
  bedrooms: number
  location: string
  address: string
  description: string
  features: string[]
  imageUrl: string
  agent: string
  phone: string
  email?: string
  postedDate: string
  liked: boolean
  images: number
  city: string
  province: string
  energyLabel: string
  yearBuilt?: number
  garden?: boolean
  parking?: boolean
  featured: boolean
}

// No demo data - real estate will be loaded from Supabase
const sampleRealEstate: RealEstate[] = []

const removedSampleData = [
  {
    id: "1",
    title: "Ruim 3-kamer appartement in Amsterdam",
    type: "koop",
    propertyType: "Appartement",
    price: 850000,
    area: 85,
    rooms: 3,
    bedrooms: 2,
    location: "Amsterdam Centrum",
    address: "Prinsengracht 456, 1016 HM Amsterdam",
    description: "Prachtig appartement in een monumentaal grachtenpand. Volledig gerenoveerd met behoud van authentieke details zoals balkenplafonds en originele ramen.",
    features: ["balkon", "lift", "monumentaal", "grachtuitzicht", "energielabel C"],
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
    agent: "Petra van der Berg",
    phone: "+31 20 123 4567",
    email: "petra@amsterdammakelaar.nl",
    postedDate: "2024-01-15",
    liked: false,
    images: 25,
    city: "Amsterdam",
    province: "Noord-Holland",
    energyLabel: "C",
    yearBuilt: 1890,
    garden: false,
    parking: false,
    featured: true
  },
  {
    id: "2",
    title: "Moderne eengezinswoning met tuin",
    type: "koop",
    propertyType: "Eengezinswoning",
    price: 675000,
    area: 120,
    rooms: 5,
    bedrooms: 3,
    location: "Utrecht Leidsche Rijn",
    address: "Griftdijk Zuid 89, 3544 AL Utrecht",
    description: "Nieuwbouw eengezinswoning in moderne wijk. Grote tuin, energielabel A, en alle moderne voorzieningen op loopafstand.",
    features: ["tuin", "garage", "energielabel A", "nieuwbouw", "kindvriendelijk"],
    imageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop",
    agent: "Marco de Vries",
    phone: "+31 30 456 7890",
    email: "marco@utrechtmakelaars.nl",
    postedDate: "2024-01-12",
    liked: true,
    images: 18,
    city: "Utrecht",
    province: "Utrecht",
    energyLabel: "A",
    yearBuilt: 2022,
    garden: true,
    parking: true,
    featured: true
  },
  {
    id: "3",
    title: "Gezellig huurappartement in Rotterdam",
    type: "huur",
    propertyType: "Appartement",
    price: 1850,
    area: 65,
    rooms: 2,
    bedrooms: 1,
    location: "Rotterdam Centrum",
    address: "Witte de Withstraat 78, 3012 BS Rotterdam",
    description: "Licht en ruim appartement in het culturele hart van Rotterdam. Perfect voor jong professional of stel.",
    features: ["gemeubileerd", "balkon", "wasmachine", "internet inbegrepen"],
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
    agent: "Sarah Janssen",
    phone: "+31 10 789 0123",
    email: "sarah@rotterdamwonen.nl",
    postedDate: "2024-01-10",
    liked: false,
    images: 12,
    city: "Rotterdam",
    province: "Zuid-Holland",
    energyLabel: "B",
    yearBuilt: 1960,
    garden: false,
    parking: false,
    featured: false
  },
  {
    id: "4",
    title: "Luxe penthouse met dakterras",
    type: "koop",
    propertyType: "Penthouse",
    price: 1250000,
    area: 140,
    rooms: 4,
    bedrooms: 3,
    location: "Den Haag Statenkwartier",
    address: "Hobbemastraat 45, 2526 JN Den Haag",
    description: "Exclusief penthouse met spectaculair dakterras. Gelegen in het gewilde Statenkwartier nabij het centrum en de duinen.",
    features: ["dakterras", "lift", "parkeergelegenheid", "airco", "luxe afwerking"],
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
    agent: "Robert van Dijk",
    phone: "+31 70 234 5678",
    email: "robert@haagseluxemakelaars.nl",
    postedDate: "2024-01-08",
    liked: true,
    images: 32,
    city: "Den Haag",
    province: "Zuid-Holland",
    energyLabel: "A",
    yearBuilt: 2019,
    garden: false,
    parking: true,
    featured: true
  },
  {
    id: "5",
    title: "Studentenkamer in Groningen",
    type: "huur",
    propertyType: "Studio",
    price: 650,
    area: 25,
    rooms: 1,
    bedrooms: 1,
    location: "Groningen Centrum",
    address: "Oosterstraat 67, 9711 NR Groningen",
    description: "Compacte maar complete studentenkamer nabij de universiteit. Alle voorzieningen aanwezig voor comfortabel wonen.",
    features: ["gemeubileerd", "internet", "nabij universiteit", "fietsenstalling"],
    imageUrl: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&h=300&fit=crop",
    agent: "Lisa Scholten",
    phone: "+31 50 345 6789",
    email: "lisa@groningenstudentenkamers.nl",
    postedDate: "2024-01-05",
    liked: false,
    images: 8,
    city: "Groningen",
    province: "Groningen",
    energyLabel: "C",
    yearBuilt: 1925,
    garden: false,
    parking: false,
    featured: false
  },
  {
    id: "6",
    title: "Karakteristieke boerderij in Giethoorn",
    type: "koop",
    propertyType: "Boerderij",
    price: 895000,
    area: 200,
    rooms: 6,
    bedrooms: 4,
    location: "Giethoorn",
    address: "Binnenpad 234, 8355 BP Giethoorn",
    description: "Unieke rietgedekte boerderij aan het water in het pittoreske Giethoorn. Volledig gerestaureerd met respect voor het monumentale karakter.",
    features: ["monument", "waterfront", "grote tuin", "authentiek", "rietgedekt"],
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    agent: "Johan Mulder",
    phone: "+31 521 361 234",
    email: "johan@giethoornmakelaars.nl",
    postedDate: "2024-01-03",
    liked: true,
    images: 28,
    city: "Giethoorn",
    province: "Overijssel",
    energyLabel: "D",
    yearBuilt: 1750,
    garden: true,
    parking: true,
    featured: true
  },
  {
    id: "7",
    title: "Modern appartement in Eindhoven",
    type: "huur",
    propertyType: "Appartement",
    price: 1650,
    area: 75,
    rooms: 3,
    bedrooms: 2,
    location: "Eindhoven Centrum",
    address: "18 Septemberplein 32, 5611 AG Eindhoven",
    description: "Strak vormgegeven appartement nabij het station en High Tech Campus. Ideaal voor expats en professionals.",
    features: ["balkon", "lift", "nabij OV", "energielabel A", "expat friendly"],
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    agent: "Emma Hendriks",
    phone: "+31 40 567 8901",
    email: "emma@eindhovenexpat.nl",
    postedDate: "2024-01-01",
    liked: false,
    images: 15,
    city: "Eindhoven",
    province: "Noord-Brabant",
    energyLabel: "A",
    yearBuilt: 2021,
    garden: false,
    parking: true,
    featured: false
  }
]

export function RealEstateView() {
  const [realEstate, setRealEstate] = useKV<RealEstate[]>("real-estate-data", sampleRealEstate)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedPropertyType, setSelectedPropertyType] = useState("all")
  const [selectedProvince, setSelectedProvince] = useState("all")
  const [priceRange, setPriceRange] = useState("all")

  const types = ["all", "koop", "huur"]
  const propertyTypes = ["all", "Appartement", "Eengezinswoning", "Penthouse", "Studio", "Boerderij"]
  const provinces = ["all", "Noord-Holland", "Zuid-Holland", "Utrecht", "Noord-Brabant", "Groningen", "Overijssel"]
  const priceRanges = [
    { label: "Alle prijzen", value: "all" },
    { label: "€0 - €500k", value: "0-500000" },
    { label: "€500k - €1M", value: "500000-1000000" },
    { label: "€1M+", value: "1000000+" },
    { label: "€0 - €1500", value: "0-1500" },
    { label: "€1500 - €2500", value: "1500-2500" },
    { label: "€2500+", value: "2500+" }
  ]

  const filteredRealEstate = (realEstate || []).filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.city.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedType === "all" || property.type === selectedType
    const matchesPropertyType = selectedPropertyType === "all" || property.propertyType === selectedPropertyType
    const matchesProvince = selectedProvince === "all" || property.province === selectedProvince
    
    let matchesPrice = true
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(p => p.replace("+", "")).map(Number)
      if (priceRange.includes("+")) {
        matchesPrice = property.price >= min
      } else {
        matchesPrice = property.price >= min && property.price <= max
      }
    }
    
    return matchesSearch && matchesType && matchesPropertyType && matchesProvince && matchesPrice
  })

  const toggleLike = (propertyId: string) => {
    setRealEstate((currentProperties = []) =>
      currentProperties.map(property =>
        property.id === propertyId ? { ...property, liked: !property.liked } : property
      )
    )
  }

  const formatPrice = (price: number, type: string) => {
    if (type === "huur") {
      return `€${(price || 0).toLocaleString()}/maand`
    }
    if (price >= 1000000) {
      return `€${((price || 0) / 1000000).toFixed(1)}M`
    }
    return `€${((price || 0) / 1000).toFixed(0)}k`
  }

  const featuredProperties = filteredRealEstate.filter(property => property.featured)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Vastgoed & Woningen</h1>
          <p className="text-muted-foreground">Vind je droomhuis in heel Nederland</p>
        </div>
        <Button>
          <PlusIcon className="w-4 h-4 mr-2" />
          Nieuwe Woning
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Zoek woningen, locaties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select 
          value={selectedType} 
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background"
        >
          {types.map(type => (
            <option key={type} value={type}>
              {type === "all" ? "Koop & Huur" : type === "koop" ? "Koop" : "Huur"}
            </option>
          ))}
        </select>

        <select 
          value={selectedPropertyType} 
          onChange={(e) => setSelectedPropertyType(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background"
        >
          {propertyTypes.map(type => (
            <option key={type} value={type}>
              {type === "all" ? "Alle types" : type}
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

        <select 
          value={priceRange} 
          onChange={(e) => setPriceRange(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background"
        >
          {priceRanges.map(range => (
            <option key={range.value} value={range.value}>{range.label}</option>
          ))}
        </select>
      </div>

      <Tabs defaultValue="featured" className="space-y-6">
        <TabsList>
          <TabsTrigger value="featured">Aanbevolen Woningen ({featuredProperties.length})</TabsTrigger>
          <TabsTrigger value="all">Alle Woningen ({filteredRealEstate.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="space-y-6">
          {featuredProperties.length === 0 ? (
            <Card className="p-12 text-center">
              <CardContent>
                <HomeIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Geen aanbevolen woningen gevonden</h3>
                <p className="text-muted-foreground">Probeer je zoekopdracht aan te passen of andere filters te gebruiken.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  onToggleLike={() => toggleLike(property.id)}
                  formatPrice={formatPrice}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          {filteredRealEstate.length === 0 ? (
            <Card className="p-12 text-center">
              <CardContent>
                <MagnifyingGlassIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Geen woningen gevonden</h3>
                <p className="text-muted-foreground">Probeer je zoekopdracht aan te passen of andere filters te gebruiken.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRealEstate.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  onToggleLike={() => toggleLike(property.id)}
                  formatPrice={formatPrice}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Totaal Woningen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{realEstate?.length || 0}</div>
                <p className="text-xs text-muted-foreground">{featuredProperties.length} aanbevolen</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Gem. Prijs Koop</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  €{Math.round((realEstate || []).filter(p => p.type === "koop").reduce((sum, p) => sum + p.price, 0) / ((realEstate || []).filter(p => p.type === "koop").length || 1) / 1000)}k
                </div>
                <p className="text-xs text-muted-foreground">gemiddelde koopprijs</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Gem. Huurprijs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  €{Math.round((realEstate || []).filter(p => p.type === "huur").reduce((sum, p) => sum + p.price, 0) / ((realEstate || []).filter(p => p.type === "huur").length || 1))}
                </div>
                <p className="text-xs text-muted-foreground">per maand</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Gem. Oppervlakte</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((realEstate || []).reduce((sum, p) => sum + p.area, 0) / (realEstate?.length || 1))} m²
                </div>
                <p className="text-xs text-muted-foreground">gemiddelde grootte</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PropertyCard({ property, onToggleLike, formatPrice }: { 
  property: RealEstate, 
  onToggleLike: () => void,
  formatPrice: (price: number, type: string) => string
}) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative">
        <img 
          src={property.imageUrl} 
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-2 left-2 flex gap-2">
          <Badge 
            variant={property.type === "koop" ? "default" : "secondary"}
            className="text-xs"
          >
            {property.type === "koop" ? "Te Koop" : "Te Huur"}
          </Badge>
          {property.featured && (
            <Badge className="bg-accent text-accent-foreground text-xs">
              Aanbevolen
            </Badge>
          )}
        </div>
        
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={onToggleLike}
          >
            {property.liked ? (
              <HeartSolidIcon className="w-4 h-4 text-red-500" />
            ) : (
              <HeartIcon className="w-4 h-4" />
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

        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-1 text-white text-sm">
            <CameraIcon className="w-4 h-4" />
            <span>{property.images}</span>
          </div>
          <Button size="sm" className="bg-primary/90 hover:bg-primary">
            Bekijk Woning
          </Button>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-1">{property.title}</CardTitle>
          <div className="text-lg font-bold text-primary flex-shrink-0">
            {formatPrice(property.price, property.type)}
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPinIcon className="w-4 h-4" />
          <span>{property.city}, {property.province}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        <CardDescription className="line-clamp-2 text-sm">
          {property.description}
        </CardDescription>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <div>{property.address}</div>
          <div className="flex items-center gap-1">
            <PhoneIcon className="w-3 h-3" />
            {property.phone}
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 text-sm text-center">
          <div>
            <div className="font-medium">{property.area} m²</div>
            <div className="text-muted-foreground text-xs">oppervlakte</div>
          </div>
          <div>
            <div className="font-medium">{property.rooms}</div>
            <div className="text-muted-foreground text-xs">kamers</div>
          </div>
          <div>
            <div className="font-medium">{property.bedrooms}</div>
            <div className="text-muted-foreground text-xs">slaapkamers</div>
          </div>
          <div>
            <div className="font-medium text-xs">{property.energyLabel}</div>
            <div className="text-muted-foreground text-xs">energielabel</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {property.features.slice(0, 3).map((feature, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {feature}
            </Badge>
          ))}
          {property.features.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{property.features.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>{property.agent}</span>
          <span>{new Date(property.postedDate).toLocaleDateString('nl-NL')}</span>
        </div>
      </CardContent>
    </Card>
  )
}