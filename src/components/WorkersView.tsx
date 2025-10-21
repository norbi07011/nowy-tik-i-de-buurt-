import { useState } from "react"
import { useKV } from "@/hooks/use-local-storage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserIcon, StarIcon, MapPinIcon, ClockIcon, PhoneIcon, PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"

type Worker = {
  id: string
  name: string
  profession: string
  specialization: string[]
  experience: number
  rating: number
  reviews: number
  hourlyRate: number
  location: string
  address: string
  city: string
  province: string
  availability: "beschikbaar" | "bezet" | "niet beschikbaar"
  description: string
  services: string[]
  imageUrl: string
  phone: string
  email: string
  verified: boolean
  completedJobs: number
  languages: string[]
  certifications: string[]
  featured: boolean
}

// No demo data - workers will be loaded from Supabase
const sampleWorkers: Worker[] = []

const removedSampleData = [
  {
    id: "1",
    name: "Pieter van der Berg",
    profession: "Loodgieter",
    specialization: ["badkamerrenovaties", "leidingwerk", "24/7 storingsdienst"],
    experience: 12,
    rating: 4.9,
    reviews: 287,
    hourlyRate: 45,
    location: "Amsterdam Centrum",
    address: "Prinsengracht 234, 1016 HE Amsterdam",
    city: "Amsterdam",
    province: "Noord-Holland",
    availability: "beschikbaar",
    description: "Ervaren loodgieter met 12 jaar ervaring in Amsterdam. Gespecialiseerd in badkamerrenovaties en noodreparaties.",
    services: ["kraan reparatie", "leidingwerk", "badkamer installatie", "CV ketel onderhoud"],
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    phone: "+31 20 123 4567",
    email: "pieter@amsterdamloodgieter.nl",
    verified: true,
    completedJobs: 412,
    languages: ["Nederlands", "Engels"],
    certifications: ["VCA", "W-installaties"],
    featured: true
  },
  {
    id: "2",
    name: "Sophie de Vries",
    profession: "Schoonmaakster",
    specialization: ["huishoudelijke hulp", "kantoorschoonmaak", "na-verbouwing schoonmaak"],
    experience: 6,
    rating: 4.8,
    reviews: 156,
    hourlyRate: 18,
    location: "Utrecht Centrum",
    address: "Oudegracht 445, 3511 PA Utrecht",
    city: "Utrecht",
    province: "Utrecht",
    availability: "beschikbaar",
    description: "Betrouwbare schoonmaakster met oog voor detail. Gebruik uitsluitend milieuvriendelijke schoonmaakmiddelen.",
    services: ["huishoudelijke hulp", "ramen lappen", "kantoor schoonmaken", "dieptereiniging"],
    imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b0598cd4?w=200&h=200&fit=crop&crop=face",
    phone: "+31 30 456 7890",
    email: "sophie@utrechtschoon.nl",
    verified: true,
    completedJobs: 234,
    languages: ["Nederlands", "Engels", "Duits"],
    certifications: ["Schoonmaak certificaat"],
    featured: false
  },
  {
    id: "3",
    name: "Marco Hendriks",
    profession: "Elektricien",
    specialization: ["domotica", "industriële installaties", "zonnepanelen"],
    experience: 15,
    rating: 4.7,
    reviews: 198,
    hourlyRate: 55,
    location: "Eindhoven High Tech",
    address: "High Tech Campus 12, 5656 AE Eindhoven",
    city: "Eindhoven",
    province: "Noord-Brabant",
    availability: "bezet",
    description: "Gespecialiseerde elektricien in domotica en slimme woningen. Werkt veel in de high-tech sector van Eindhoven.",
    services: ["slimme woning installaties", "zonnepanelen", "LED verlichting", "laadpalen auto's"],
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    phone: "+31 40 789 0123",
    email: "marco@eindhovenelektro.nl",
    verified: true,
    completedJobs: 356,
    languages: ["Nederlands", "Engels"],
    certifications: ["NEN 3140", "Zonnepanelen installateur"],
    featured: true
  },
  {
    id: "4",
    name: "Emma Bakker",
    profession: "Oppas",
    specialization: ["kinderopvang", "huiswerkbegeleiding", "creatieve activiteiten"],
    experience: 8,
    rating: 5.0,
    reviews: 124,
    hourlyRate: 12,
    location: "Den Haag Bezuidenhout",
    address: "Bezuidenhoutseweg 67, 2594 AC Den Haag",
    city: "Den Haag",
    province: "Zuid-Holland",
    availability: "beschikbaar",
    description: "Ervaren kinderoppas met pedagogische achtergrond. Houdt van creatieve activiteiten en buitenspel met kinderen.",
    services: ["kinderopvang", "huiswerkbegeleiding", "creatieve workshops", "buitenspel"],
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    phone: "+31 70 234 5678",
    email: "emma@haagseoppas.nl",
    verified: true,
    completedJobs: 189,
    languages: ["Nederlands", "Engels", "Frans"],
    certifications: ["Eerste hulp kinderen", "VCA"],
    featured: false
  },
  {
    id: "5",
    name: "Lars Mulder",
    profession: "Tuinman",
    specialization: ["tuinontwerp", "onderhoud", "beplanting"],
    experience: 10,
    rating: 4.6,
    reviews: 167,
    hourlyRate: 35,
    location: "Rotterdam Zuid",
    address: "Maashaven Zuidzijde 45, 3072 HS Rotterdam",
    city: "Rotterdam",
    province: "Zuid-Holland",
    availability: "beschikbaar",
    description: "Professionele tuinman gespecialiseerd in duurzaam tuinontwerp en -onderhoud. Kennis van Nederlandse flora.",
    services: ["tuinontwerp", "snoeiwerk", "gazons aanleggen", "tuinonderhoud"],
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    phone: "+31 10 345 6789",
    email: "lars@rotterdamtuinen.nl",
    verified: true,
    completedJobs: 278,
    languages: ["Nederlands", "Engels"],
    certifications: ["Tuinman certificaat", "Boom verzorging"],
    featured: true
  },
  {
    id: "6",
    name: "Isabel Santos",
    profession: "Massagetherapeut",
    specialization: ["ontspanningsmassage", "fysiotherapie", "thuismassage"],
    experience: 7,
    rating: 4.9,
    reviews: 89,
    hourlyRate: 75,
    location: "Groningen Centrum",
    address: "Grote Markt 23, 9712 HN Groningen",
    city: "Groningen",
    province: "Groningen",
    availability: "niet beschikbaar",
    description: "Gecertificeerde massagetherapeute met specialisatie in stressverlichting en fysiotherapeutische massage.",
    services: ["ontspanningsmassage", "sportmassage", "lymfedrainage", "fysiotherapie"],
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
    phone: "+31 50 456 7890",
    email: "isabel@groningenmassage.nl",
    verified: true,
    completedJobs: 145,
    languages: ["Nederlands", "Engels", "Spaans", "Portugees"],
    certifications: ["Massage therapeut", "Fysiotherapie basis"],
    featured: false
  },
  {
    id: "7",
    name: "David van Dijk",
    profession: "Schilder",
    specialization: ["binnen schilderwerk", "decoratief", "monumentaal"],
    experience: 14,
    rating: 4.8,
    reviews: 203,
    hourlyRate: 40,
    location: "Haarlem Centrum",
    address: "Grote Markt 8, 2011 RD Haarlem",
    city: "Haarlem",
    province: "Noord-Holland",
    availability: "beschikbaar",
    description: "Ervaren schilder gespecialiseerd in monumentaal werk en decoratieve technieken. Traditionele ambachtsmethoden.",
    services: ["binnen schilderen", "behang plakken", "decoratief werk", "monumentaal onderhoud"],
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face",
    phone: "+31 23 567 8901",
    email: "david@haarlemschilder.nl",
    verified: true,
    completedJobs: 334,
    languages: ["Nederlands", "Engels"],
    certifications: ["Schilder vakdiploma", "Monumentenzorg"],
    featured: true
  }
]

export function WorkersView() {
  const [workers, setWorkers] = useKV<Worker[]>("workers-data", sampleWorkers)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProfession, setSelectedProfession] = useState("all")
  const [selectedAvailability, setSelectedAvailability] = useState("all")
  const [selectedProvince, setSelectedProvince] = useState("all")
  const [maxRate, setMaxRate] = useState(100)

  const professions = ["all", "Loodgieter", "Elektricien", "Schilder", "Schoonmaakster", "Oppas", "Tuinman", "Massagetherapeut"]
  const availabilityOptions = ["all", "beschikbaar", "bezet", "niet beschikbaar"]
  const provinces = ["all", "Noord-Holland", "Zuid-Holland", "Utrecht", "Noord-Brabant", "Groningen"]

  const filteredWorkers = (workers || []).filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         worker.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         worker.city.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesProfession = selectedProfession === "all" || worker.profession === selectedProfession
    const matchesAvailability = selectedAvailability === "all" || worker.availability === selectedAvailability
    const matchesProvince = selectedProvince === "all" || worker.province === selectedProvince
    const matchesRate = worker.hourlyRate <= maxRate
    
    return matchesSearch && matchesProfession && matchesAvailability && matchesProvince && matchesRate
  })

  const sortedWorkers = filteredWorkers.sort((a, b) => {
    // Sort by featured first, then availability, then rating
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    if (a.availability === "beschikbaar" && b.availability !== "beschikbaar") return -1
    if (a.availability !== "beschikbaar" && b.availability === "beschikbaar") return 1
    return b.rating - a.rating
  })

  const featuredWorkers = sortedWorkers.filter(worker => worker.featured)

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "beschikbaar": return "bg-green-500"
      case "bezet": return "bg-yellow-500"
      case "niet beschikbaar": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getAvailabilityVariant = (availability: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (availability) {
      case "beschikbaar": return "default"
      case "bezet": return "secondary"
      case "niet beschikbaar": return "destructive"
      default: return "outline"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Professionals & Dienstverleners</h1>
          <p className="text-muted-foreground">Vind betrouwbare professionals voor al je klussen in Nederland</p>
        </div>
        <Button>
          <PlusIcon className="w-4 h-4 mr-2" />
          Nieuwe Professional
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Zoek professionals, diensten..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select 
          value={selectedProfession} 
          onChange={(e) => setSelectedProfession(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background"
        >
          {professions.map(profession => (
            <option key={profession} value={profession}>
              {profession === "all" ? "Alle beroepen" : profession}
            </option>
          ))}
        </select>

        <select 
          value={selectedAvailability} 
          onChange={(e) => setSelectedAvailability(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background"
        >
          {availabilityOptions.map(availability => (
            <option key={availability} value={availability}>
              {availability === "all" ? "Alle beschikbaarheid" : 
               availability === "beschikbaar" ? "Beschikbaar" :
               availability === "bezet" ? "Bezet" : "Niet Beschikbaar"}
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

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium whitespace-nowrap">Max €</label>
          <Input
            type="number"
            value={maxRate}
            onChange={(e) => setMaxRate(Number(e.target.value))}
            className="w-full"
            placeholder="Tarief/uur"
          />
          <span className="text-sm text-muted-foreground">/uur</span>
        </div>
      </div>

      <Tabs defaultValue="featured" className="space-y-6">
        <TabsList>
          <TabsTrigger value="featured">Aanbevolen Professionals ({featuredWorkers.length})</TabsTrigger>
          <TabsTrigger value="all">Alle Professionals ({sortedWorkers.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="space-y-6">
          {featuredWorkers.length === 0 ? (
            <Card className="p-12 text-center">
              <CardContent>
                <UserIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Geen aanbevolen professionals gevonden</h3>
                <p className="text-muted-foreground">Probeer je zoekopdracht aan te passen of andere filters te gebruiken.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredWorkers.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          {sortedWorkers.length === 0 ? (
            <Card className="p-12 text-center">
              <CardContent>
                <MagnifyingGlassIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Geen professionals gevonden</h3>
                <p className="text-muted-foreground">Probeer je zoekopdracht aan te passen of andere filters te gebruiken.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedWorkers.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Totaal Professionals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workers?.length || 0}</div>
                <p className="text-xs text-muted-foreground">{featuredWorkers.length} aanbevolen</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Gem. Tarief</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  €{Math.round((workers || []).reduce((sum, w) => sum + w.hourlyRate, 0) / (workers?.length || 1))}
                </div>
                <p className="text-xs text-muted-foreground">per uur</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Beschikbaar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(workers || []).filter(w => w.availability === "beschikbaar").length}
                </div>
                <p className="text-xs text-muted-foreground">professionals beschikbaar</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Gem. Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((workers || []).reduce((sum, w) => sum + w.rating, 0) / (workers?.length || 1)).toFixed(1)}
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

function WorkerCard({ worker }: { worker: Worker }) {
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "beschikbaar": return "bg-green-500"
      case "bezet": return "bg-yellow-500"
      case "niet beschikbaar": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getAvailabilityVariant = (availability: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (availability) {
      case "beschikbaar": return "default"
      case "bezet": return "secondary"
      case "niet beschikbaar": return "destructive"
      default: return "outline"
    }
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img 
              src={worker.imageUrl} 
              alt={worker.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getAvailabilityColor(worker.availability)} border-2 border-white`}></div>
            {worker.verified && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
            {worker.featured && (
              <Badge className="absolute -top-2 -left-2 bg-accent text-accent-foreground text-xs">
                Aanbevolen
              </Badge>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-1">{worker.name}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">{worker.profession}</span>
              <span>•</span>
              <span>{worker.experience} jaar ervaring</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{worker.rating}</span>
                <span className="text-sm text-muted-foreground">({worker.reviews})</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-primary">€{worker.hourlyRate}/uur</div>
            <div className="text-xs text-muted-foreground">{worker.completedJobs} klussen</div>
          </div>
        </div>
        
        <Badge variant={getAvailabilityVariant(worker.availability)} className="w-fit text-xs">
          {worker.availability === "beschikbaar" ? "Beschikbaar" :
           worker.availability === "bezet" ? "Bezet" : "Niet Beschikbaar"}
        </Badge>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        <CardDescription className="line-clamp-2 text-sm">
          {worker.description}
        </CardDescription>

        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-1">
            <MapPinIcon className="w-3 h-3" />
            {worker.address}
          </div>
          <div className="flex items-center gap-1">
            <PhoneIcon className="w-3 h-3" />
            {worker.phone}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Specialisaties:</h4>
          <div className="flex flex-wrap gap-1">
            {worker.specialization.slice(0, 2).map((spec, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {spec}
              </Badge>
            ))}
            {worker.specialization.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{worker.specialization.length - 2}
              </Badge>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Diensten:</h4>
          <div className="text-sm text-muted-foreground">
            {worker.services.slice(0, 3).join(", ")}
            {worker.services.length > 3 && "..."}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Talen:</h4>
          <div className="flex flex-wrap gap-1">
            {worker.languages.map((lang, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {lang}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            className="flex-1"
            disabled={worker.availability === "niet beschikbaar"}
          >
            <PhoneIcon className="w-4 h-4 mr-2" />
            Contact
          </Button>
          <Button variant="outline" className="flex-1">
            Bekijk Profiel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}