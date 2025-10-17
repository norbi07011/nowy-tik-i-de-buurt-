import { useState } from "react"
import { useKV } from "@/hooks/use-local-storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Camera, 
  Video, 
  FileText, 
  Star, 
  Users, 
  TrendingUp,
  Edit,
  Plus,
  Save,
  Eye,
  MessageSquare,
  Share2,
  Award,
  Calendar,
  Target
} from "lucide-react"
import { BusinessGallery } from "@/components/business/BusinessGallery"
import { BusinessMap } from "@/components/business/BusinessMap"
import { BusinessForms } from "@/components/business/BusinessForms"
import { BusinessPortfolio } from "@/components/business/BusinessPortfolio"
import { BusinessPromotions } from "@/components/business/BusinessPromotions"
import { BusinessStats } from "@/components/business/BusinessStats"
import { BusinessReviews } from "@/components/business/BusinessReviews"
import { BusinessContact } from "@/components/business/BusinessContact"
import { AnalyticsView } from "@/components/AnalyticsView"
import { SalesTransmissionView } from "@/components/SalesTransmissionView"
import { ReviewManagementView } from "@/components/ReviewManagementView"
import { MarketingServicesView } from "@/components/MarketingServicesView"

interface BusinessStats {
  views: number
  contacts: number
  reviews: number
  rating: number
  growth: number
}

interface BusinessProfile {
  name: string
  description: string
  category: string
  address: string
  phone: string
  email: string
  website: string
  hours: {
    [key: string]: { open: string; close: string; closed: boolean }
  }
  socialMedia: {
    facebook: string
    instagram: string
    linkedin: string
  }
  services: string[]
  tags: string[]
}

export function MyBusinessView() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [businessProfile, setBusinessProfile] = useKV<BusinessProfile>("business-profile", {
    name: "Moja Firma",
    description: "Profesjonalne usługi w Twojej okolicy",
    category: "Usługi",
    address: "ul. Przykładowa 123, 00-000 Miasto",
    phone: "+48 123 456 789",
    email: "kontakt@mojafirma.pl",
    website: "www.mojafirma.pl",
    hours: {
      monday: { open: "09:00", close: "17:00", closed: false },
      tuesday: { open: "09:00", close: "17:00", closed: false },
      wednesday: { open: "09:00", close: "17:00", closed: false },
      thursday: { open: "09:00", close: "17:00", closed: false },
      friday: { open: "09:00", close: "17:00", closed: false },
      saturday: { open: "10:00", close: "14:00", closed: false },
      sunday: { open: "10:00", close: "14:00", closed: true }
    },
    socialMedia: {
      facebook: "",
      instagram: "",
      linkedin: ""
    },
    services: ["Usługa 1", "Usługa 2", "Usługa 3"],
    tags: ["profesjonalne", "lokalne", "zaufane"]
  })

  const [businessStats] = useKV<BusinessStats>("business-stats", {
    views: 1247,
    contacts: 89,
    reviews: 42,
    rating: 4.8,
    growth: 23.5
  })

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to backend
  }

  const ProfileOverview = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{businessProfile?.name || "Moja Firma"}</h2>
                <p className="text-muted-foreground">{businessProfile?.category || "Usługi"}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="font-medium">{businessStats?.rating || 0}</span>
                    <span className="text-muted-foreground ml-1">({businessStats?.reviews || 0} opinii)</span>
                  </div>
                  <Badge variant="outline">Zweryfikowana</Badge>
                </div>
              </div>
            </div>
            <Button 
              variant={isEditing ? "default" : "outline"} 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
              {isEditing ? "Zapisz" : "Edytuj"}
            </Button>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <Eye className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{businessStats?.views || 0}</div>
              <div className="text-sm text-muted-foreground">Wyświetlenia</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <MessageSquare className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{businessStats?.contacts || 0}</div>
              <div className="text-sm text-muted-foreground">Kontakty</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{businessStats?.reviews || 0}</div>
              <div className="text-sm text-muted-foreground">Opinie</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">+{businessStats?.growth || 0}%</div>
              <div className="text-sm text-muted-foreground">Wzrost</div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Opis firmy</Label>
                {isEditing ? (
                  <Textarea
                    id="description"
                    value={businessProfile?.description || ""}
                    onChange={(e) => setBusinessProfile(prev => ({ ...prev!, description: e.target.value }))}
                    className="mt-1"
                    rows={3}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">{businessProfile?.description || "Brak opisu"}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{businessProfile?.address || "Brak adresu"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{businessProfile?.phone || "Brak telefonu"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{businessProfile?.email || "Brak emaila"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{businessProfile?.website || "Brak strony"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Usługi</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {(businessProfile?.services || []).map((service, index) => (
                    <Badge key={index} variant="secondary">{service}</Badge>
                  ))}
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      <Plus className="w-3 h-3 mr-1" />
                      Dodaj
                    </Button>
                  )}
                </div>
              </div>
              
              <div>
                <Label>Tagi</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {(businessProfile?.tags || []).map((tag, index) => (
                    <Badge key={index} variant="outline">#{tag}</Badge>
                  ))}
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      <Plus className="w-3 h-3 mr-1" />
                      Dodaj
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("gallery")}>
          <div className="flex items-center space-x-3">
            <Camera className="w-8 h-8 text-primary" />
            <div>
              <h3 className="font-medium">Galeria</h3>
              <p className="text-sm text-muted-foreground">Zarządzaj zdjęciami</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("portfolio")}>
          <div className="flex items-center space-x-3">
            <Award className="w-8 h-8 text-primary" />
            <div>
              <h3 className="font-medium">Portfolio</h3>
              <p className="text-sm text-muted-foreground">Pokaż swoje prace</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("promotions")}>
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8 text-primary" />
            <div>
              <h3 className="font-medium">Promocje</h3>
              <p className="text-sm text-muted-foreground">Zarządzaj ofertami</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Profil firmy</h1>
        <p className="text-muted-foreground">Kompleksowe zarządzanie profilem biznesowym - wszystko w jednym miejscu</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-12 lg:w-auto lg:grid-cols-none lg:flex">
          <TabsTrigger value="overview">Przegląd</TabsTrigger>
          <TabsTrigger value="gallery">Galeria</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="promotions">Promocje</TabsTrigger>
          <TabsTrigger value="analytics">Analityka</TabsTrigger>
          <TabsTrigger value="sales">Sprzedaż</TabsTrigger>
          <TabsTrigger value="reviews">Opinie</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="map">Mapa</TabsTrigger>
          <TabsTrigger value="forms">Formularze</TabsTrigger>
          <TabsTrigger value="contact">Kontakt</TabsTrigger>
          <TabsTrigger value="stats">Statystyki</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ProfileOverview />
        </TabsContent>

        <TabsContent value="gallery">
          <BusinessGallery />
        </TabsContent>

        <TabsContent value="portfolio">
          <BusinessPortfolio />
        </TabsContent>

        <TabsContent value="promotions">
          <BusinessPromotions />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsView />
        </TabsContent>

        <TabsContent value="sales">
          <SalesTransmissionView />
        </TabsContent>

        <TabsContent value="reviews">
          <ReviewManagementView />
        </TabsContent>

        <TabsContent value="marketing">
          <MarketingServicesView />
        </TabsContent>

        <TabsContent value="map">
          <BusinessMap />
        </TabsContent>

        <TabsContent value="forms">
          <BusinessForms />
        </TabsContent>

        <TabsContent value="contact">
          <BusinessContact />
        </TabsContent>

        <TabsContent value="stats">
          <BusinessStats />
        </TabsContent>
      </Tabs>
    </div>
  )
}