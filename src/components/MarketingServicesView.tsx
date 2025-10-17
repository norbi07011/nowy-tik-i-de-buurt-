import { useState } from "react"
import { useKV } from "@/hooks/use-local-storage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  MegaphoneIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  PresentationChartLineIcon,
  TrophyIcon,
  StarIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  PhotoIcon,
  PlayIcon,
  TagIcon
} from "@heroicons/react/24/outline"

type MarketingService = {
  id: string
  title: string
  category: string
  description: string
  price: string
  duration: string
  features: string[]
  targetAudience: string[]
  platforms: string[]
  roi: string
  popularity: number
  rating: number
  reviews: number
  status: "active" | "draft" | "completed"
  createdAt: string
  tags: string[]
}

const marketingServices: MarketingService[] = [
  {
    id: "1",
    title: "Lokale SEO Campagne",
    category: "Local SEO",
    description: "Verbeter je lokale vindbaarheid in Google My Business en lokale zoekresultaten. Perfect voor lokale bedrijven die meer klanten willen trekken.",
    price: "€299/maand",
    duration: "3-6 maanden",
    features: [
      "Google My Business optimalisatie",
      "Lokale keyword research",
      "Citations opbouw",
      "Review management",
      "Lokale content strategie",
      "Maandelijkse rapportages"
    ],
    targetAudience: ["Lokale bedrijven", "Restaurants", "Winkels", "Dienstverleners"],
    platforms: ["Google", "Google Maps", "Bing Places"],
    roi: "+150% lokale traffic",
    popularity: 95,
    rating: 4.8,
    reviews: 124,
    status: "active",
    createdAt: "2024-01-15",
    tags: ["SEO", "lokaal", "Google", "vindbaarheid"]
  },
  {
    id: "2",
    title: "Social Media Marketing Pakket",
    category: "Social Media Campaign",
    description: "Complete social media strategie voor Facebook, Instagram en LinkedIn. Inclusief content creatie en community management.",
    price: "€399/maand",
    duration: "6-12 maanden",
    features: [
      "Content planning & creatie",
      "Dagelijkse posts",
      "Stories & Reels",
      "Community management",
      "Influencer samenwerking",
      "Analytics & reporting"
    ],
    targetAudience: ["E-commerce", "B2B bedrijven", "Jonge doelgroep", "Lifestyle merken"],
    platforms: ["Facebook", "Instagram", "LinkedIn", "TikTok"],
    roi: "+200% engagement",
    popularity: 88,
    rating: 4.6,
    reviews: 89,
    status: "active",
    createdAt: "2024-01-20",
    tags: ["social media", "content", "engagement", "community"]
  },
  {
    id: "3",
    title: "Brand Awareness Video Campagne",
    category: "Brand Awareness",
    description: "Professionele videoproductie en distributie voor verhoogde merkbekendheid. Van concept tot verspreiding op alle kanalen.",
    price: "€1499 eenmalig",
    duration: "4-8 weken",
    features: [
      "Video concept ontwikkeling",
      "Professionele opname",
      "Post-productie & editing",
      "Multi-platform optimalisatie",
      "Paid advertising strategie",
      "Performance tracking"
    ],
    targetAudience: ["Grote bedrijven", "Product launches", "B2C merken", "Tech startups"],
    platforms: ["YouTube", "Facebook", "Instagram", "LinkedIn", "Website"],
    roi: "+300% merkherkenning",
    popularity: 76,
    rating: 4.9,
    reviews: 45,
    status: "active",
    createdAt: "2024-02-01",
    tags: ["video", "branding", "awareness", "productie"]
  },
  {
    id: "4",
    title: "Lead Generation Funnel",
    category: "Lead Generation",
    description: "Geautomatiseerde lead generation met landing pages, email marketing en nurturing campagnes voor B2B bedrijven.",
    price: "€799/maand",
    duration: "6-12 maanden",
    features: [
      "Landing page design",
      "Lead magnets creatie",
      "Email automation",
      "CRM integratie",
      "A/B testing",
      "Sales funnel optimalisatie"
    ],
    targetAudience: ["B2B services", "SaaS bedrijven", "Consultants", "Coaches"],
    platforms: ["Website", "Email", "LinkedIn", "Google Ads"],
    roi: "+400% leads",
    popularity: 82,
    rating: 4.7,
    reviews: 67,
    status: "active",
    createdAt: "2024-02-10",
    tags: ["leads", "automation", "B2B", "conversion"]
  },
  {
    id: "5",
    title: "Duurzaamheids Marketing",
    category: "Sustainability Marketing",
    description: "Communiceer je duurzaamheidsinspanningen effectief naar milieubewuste consumenten. Bouw vertrouwen en loyaliteit op.",
    price: "€599/maand",
    duration: "3-9 maanden",
    features: [
      "Duurzaamheidsstrategie",
      "Green storytelling",
      "Impact measurement",
      "Certificering support",
      "CSR communicatie",
      "Stakeholder engagement"
    ],
    targetAudience: ["Groene bedrijven", "B2C merken", "Lokale producenten", "NGOs"],
    platforms: ["Website", "Social Media", "PR", "Email"],
    roi: "+250% merkvertrouwen",
    popularity: 71,
    rating: 4.5,
    reviews: 38,
    status: "active",
    createdAt: "2024-02-15",
    tags: ["duurzaamheid", "groen", "impact", "vertrouwen"]
  },
  {
    id: "6",
    title: "Community Building Program",
    category: "Community Building",
    description: "Bouw een loyale community rond je merk met events, content en engagement strategieën. Perfect voor lokale bedrijven.",
    price: "€449/maand",
    duration: "6-18 maanden",
    features: [
      "Community strategie",
      "Event organisatie",
      "User-generated content",
      "Loyalty programma's",
      "Referral systemen",
      "Community platforms"
    ],
    targetAudience: ["Lokale bedrijven", "Lifestyle merken", "Hobby communities", "Serviceproviders"],
    platforms: ["Facebook Groups", "Discord", "Website", "Offline events"],
    roi: "+180% klantretentie",
    popularity: 64,
    rating: 4.4,
    reviews: 52,
    status: "active",
    createdAt: "2024-02-20",
    tags: ["community", "loyalty", "events", "engagement"]
  },
  {
    id: "7",
    title: "E-commerce Growth Accelerator",
    category: "Product Demo",
    description: "Complete e-commerce marketing strategie met product demos, conversion optimalisatie en sales funnel management.",
    price: "€899/maand",
    duration: "6-12 maanden",
    features: [
      "Product demo video's",
      "Conversion rate optimalisatie",
      "Shopping ads management",
      "Email marketing automation",
      "Retargeting campagnes",
      "Analytics & reporting"
    ],
    targetAudience: ["Online winkels", "Product bedrijven", "D2C merken", "Marktplaats sellers"],
    platforms: ["Website", "Google Shopping", "Facebook Ads", "Email"],
    roi: "+350% online sales",
    popularity: 92,
    rating: 4.8,
    reviews: 156,
    status: "active",
    createdAt: "2024-02-25",
    tags: ["ecommerce", "sales", "conversion", "demo"]
  },
  {
    id: "8",
    title: "Educational Content Hub",
    category: "Educational Content",
    description: "Ontwikkel waardevolle educatieve content om je expertise te tonen en leads te genereren via kennisdeling.",
    price: "€549/maand",
    duration: "4-12 maanden",
    features: [
      "Content planning",
      "Educatieve video's",
      "Webinar organisatie",
      "E-book creatie",
      "Course development",
      "Knowledge base opbouw"
    ],
    targetAudience: ["Experts", "Consultants", "B2B services", "Trainers"],
    platforms: ["Website", "YouTube", "LinkedIn", "Email"],
    roi: "+220% thought leadership",
    popularity: 68,
    rating: 4.6,
    reviews: 43,
    status: "active",
    createdAt: "2024-03-01",
    tags: ["educatie", "expertise", "content", "webinar"]
  }
]

export function MarketingServicesView() {
  const [services, setServices] = useKV<MarketingService[]>("marketing-services", marketingServices)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPriceRange, setSelectedPriceRange] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const categories = [
    "all", 
    "Local SEO", 
    "Social Media Campaign", 
    "Brand Awareness", 
    "Lead Generation", 
    "Sustainability Marketing", 
    "Community Building", 
    "Product Demo", 
    "Educational Content"
  ]
  
  const priceRanges = ["all", "€0-300", "€300-600", "€600-1000", "€1000+"]
  const statuses = ["all", "active", "draft", "completed"]

  const filteredServices = (services || []).filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || service.status === selectedStatus
    
    let matchesPrice = true
    if (selectedPriceRange !== "all") {
      const price = parseInt(service.price.replace(/[^\d]/g, ''))
      switch (selectedPriceRange) {
        case "€0-300": matchesPrice = price <= 300; break
        case "€300-600": matchesPrice = price > 300 && price <= 600; break
        case "€600-1000": matchesPrice = price > 600 && price <= 1000; break
        case "€1000+": matchesPrice = price > 1000; break
      }
    }
    
    return matchesSearch && matchesCategory && matchesPrice && matchesStatus
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Marketing Services</h1>
          <p className="text-muted-foreground">Professionele marketingdiensten om je bedrijf te laten groeien</p>
        </div>
        <Button>
          <PlusIcon className="w-4 h-4 mr-2" />
          Nieuwe Service
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Zoek marketing services, categorieën, tags..."
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
              setSelectedPriceRange("all")
              setSelectedStatus("all")
            }}
          >
            Reset Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            value={selectedPriceRange}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background text-sm"
          >
            {priceRanges.map(range => (
              <option key={range} value={range}>
                {range === "all" ? "Alle prijsklassen" : range}
              </option>
            ))}
          </select>

          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background text-sm"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === "all" ? "Alle statussen" : 
                 status === "active" ? "Actief" :
                 status === "draft" ? "Concept" : "Voltooid"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overzicht ({filteredServices.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {filteredServices.length === 0 ? (
            <Card className="p-12 text-center">
              <CardContent>
                <MegaphoneIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Geen services gevonden</h3>
                <p className="text-muted-foreground">Probeer je zoekopdracht aan te passen of andere filters te gebruiken.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Totaal Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{services?.length || 0}</div>
                <p className="text-xs text-muted-foreground">+2 deze maand</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Actieve Campagnes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(services || []).filter(s => s.status === "active").length}
                </div>
                <p className="text-xs text-muted-foreground">Marketing services</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Gemiddelde Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((services || []).reduce((sum, s) => sum + s.rating, 0) / (services?.length || 1)).toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">5.0 sterren</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Maandelijkse Omzet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€4.2K</div>
                <p className="text-xs text-muted-foreground">+15% deze maand</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border-dashed border-2 border-muted hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <PlusIcon className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                <h3 className="font-semibold mb-2">Lokale SEO Template</h3>
                <p className="text-sm text-muted-foreground">Start een lokale SEO campagne</p>
              </CardContent>
            </Card>
            <Card className="border-dashed border-2 border-muted hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <SparklesIcon className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                <h3 className="font-semibold mb-2">Social Media Template</h3>
                <p className="text-sm text-muted-foreground">Complete social media strategie</p>
              </CardContent>
            </Card>
            <Card className="border-dashed border-2 border-muted hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <PlayIcon className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                <h3 className="font-semibold mb-2">Video Marketing Template</h3>
                <p className="text-sm text-muted-foreground">Video campagne opzetten</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ServiceCard({ service }: { service: MarketingService }) {
  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{service.title}</CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">{service.category}</Badge>
              <Badge 
                variant={service.status === "active" ? "default" : service.status === "draft" ? "secondary" : "outline"}
                className="text-xs"
              >
                {service.status === "active" ? "Actief" : service.status === "draft" ? "Concept" : "Voltooid"}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-lg text-primary">{service.price}</div>
            <div className="text-xs text-muted-foreground">{service.duration}</div>
          </div>
        </div>
        <CardDescription className="text-sm">{service.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Belangrijkste Features:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            {service.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-start gap-1">
                <span className="text-primary mt-1">•</span>
                {feature}
              </li>
            ))}
            {service.features.length > 3 && (
              <li className="text-primary text-xs">+{service.features.length - 3} meer...</li>
            )}
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Target Audience:</h4>
          <div className="flex flex-wrap gap-1">
            {service.targetAudience.slice(0, 2).map((audience, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {audience}
              </Badge>
            ))}
            {service.targetAudience.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{service.targetAudience.length - 2}
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Platforms:</h4>
          <div className="flex flex-wrap gap-1">
            {service.platforms.map((platform, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {platform}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <StarIcon className="w-4 h-4" />
              {service.rating}
            </span>
            <span className="flex items-center gap-1">
              <EyeIcon className="w-4 h-4" />
              {service.reviews}
            </span>
            <span className="flex items-center gap-1">
              <TrophyIcon className="w-4 h-4" />
              {service.popularity}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-sm">
            <span className="font-medium text-green-600">{service.roi}</span>
            <p className="text-xs text-muted-foreground">Verwacht ROI</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Details
            </Button>
            <Button size="sm">
              Start Campagne
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}