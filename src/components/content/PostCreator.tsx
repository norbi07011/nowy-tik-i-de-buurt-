import { useState } from "react"
import { useKV } from "@github/spark/hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Camera, 
  Video, 
  MapPin, 
  Tag, 
  CurrencyEur, 
  Calendar, 
  Clock, 
  Users, 
  X,
  Plus,
  Image as ImageIcon,
  FileText,
  House,
  Briefcase
} from "@phosphor-icons/react"
import { toast } from "sonner"

interface PostCreatorProps {
  currentUser: any
  onPostCreated: (post: any) => void
  onClose: () => void
}

export function PostCreator({ currentUser, onPostCreated, onClose }: PostCreatorProps) {
  const [posts, setPosts] = useKV<any[]>("business-posts", [])
  
  const [formData, setFormData] = useState({
    type: "standard",
    title: "",
    content: "",
    media: [] as File[],
    tags: [] as string[],
    location: "",
    
    // Price settings
    hasPrice: false,
    price: "",
    currency: "EUR",
    isNegotiable: false,
    
    // Event settings
    isEvent: false,
    eventDate: "",
    eventTime: "",
    eventEndDate: "",
    eventEndTime: "",
    eventLocation: "",
    eventCapacity: "",
    eventPrice: "",
    isOnlineEvent: false,
    
    // Job settings
    isJob: false,
    jobPosition: "",
    jobType: "full-time",
    jobSalaryMin: "",
    jobSalaryMax: "",
    jobRequirements: [] as string[],
    jobDeadline: "",
    
    // Property settings
    isProperty: false,
    propertyType: "apartment",
    propertyListingType: "rent",
    propertyPrice: "",
    propertySize: "",
    propertyRooms: "",
    propertyBathrooms: "",
    propertyFeatures: [] as string[],
    propertyAvailableFrom: "",
    
    // Promotion settings
    isPromotion: false,
    promotionDiscount: "",
    promotionValidUntil: "",
    promotionCode: "",
    
    // Advanced settings
    isPromoted: false,
    targetAudience: "all",
    scheduledPost: false,
    publishDate: "",
    publishTime: ""
  })
  
  const [currentTag, setCurrentTag] = useState("")
  const [currentRequirement, setCurrentRequirement] = useState("")
  const [currentFeature, setCurrentFeature] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const postTypes = [
    { value: "standard", label: "Standaard bericht", icon: FileText },
    { value: "promotion", label: "Promotie/Aanbieding", icon: Tag },
    { value: "event", label: "Evenement", icon: Calendar },
    { value: "job", label: "Vacature", icon: Briefcase },
    { value: "property", label: "Vastgoed", icon: House },
    { value: "announcement", label: "Aankondiging", icon: FileText }
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({ 
        ...prev, 
        tags: [...prev.tags, currentTag.trim()] 
      }))
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const addRequirement = () => {
    if (currentRequirement.trim() && !formData.jobRequirements.includes(currentRequirement.trim())) {
      setFormData(prev => ({ 
        ...prev, 
        jobRequirements: [...prev.jobRequirements, currentRequirement.trim()] 
      }))
      setCurrentRequirement("")
    }
  }

  const removeRequirement = (requirementToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      jobRequirements: prev.jobRequirements.filter(req => req !== requirementToRemove)
    }))
  }

  const addFeature = () => {
    if (currentFeature.trim() && !formData.propertyFeatures.includes(currentFeature.trim())) {
      setFormData(prev => ({ 
        ...prev, 
        propertyFeatures: [...prev.propertyFeatures, currentFeature.trim()] 
      }))
      setCurrentFeature("")
    }
  }

  const removeFeature = (featureToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      propertyFeatures: prev.propertyFeatures.filter(feat => feat !== featureToRemove)
    }))
  }

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length + formData.media.length > 10) {
      toast.error("Maximaal 10 bestanden toegestaan")
      return
    }
    
    setFormData(prev => ({
      ...prev,
      media: [...prev.media, ...files]
    }))
  }

  const removeMedia = (index: number) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }))
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Titel is verplicht")
      return false
    }
    
    if (!formData.content.trim()) {
      toast.error("Inhoud is verplicht")
      return false
    }
    
    if (formData.type === "event" && formData.isEvent) {
      if (!formData.eventDate || !formData.eventTime || !formData.eventLocation) {
        toast.error("Evenement details zijn onvolledig")
        return false
      }
    }
    
    if (formData.type === "job" && formData.isJob) {
      if (!formData.jobPosition || formData.jobRequirements.length === 0) {
        toast.error("Vacature details zijn onvolledig")
        return false
      }
    }
    
    if (formData.type === "property" && formData.isProperty) {
      if (!formData.propertyPrice || !formData.propertySize) {
        toast.error("Vastgoed details zijn onvolledig")
        return false
      }
    }
    
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // Create post object
      const newPost = {
        id: Date.now().toString(),
        businessId: currentUser.id,
        businessName: currentUser.companyName || currentUser.name,
        businessAvatar: currentUser.avatar,
        category: currentUser.businessCategory || "other",
        type: formData.type,
        title: formData.title,
        content: formData.content,
        media: formData.media.map((file, index) => ({
          id: `${Date.now()}-${index}`,
          url: URL.createObjectURL(file),
          type: file.type.startsWith('image/') ? 'image' : 'video',
          title: file.name,
          size: file.size,
          mimeType: file.type
        })),
        location: formData.location,
        tags: formData.tags,
        
        // Price info
        price: formData.hasPrice ? {
          amount: parseFloat(formData.price) || 0,
          currency: formData.currency,
          isNegotiable: formData.isNegotiable
        } : null,
        
        // Event details
        eventDetails: formData.isEvent ? {
          startDate: `${formData.eventDate}T${formData.eventTime}`,
          endDate: formData.eventEndDate && formData.eventEndTime 
            ? `${formData.eventEndDate}T${formData.eventEndTime}` 
            : undefined,
          location: formData.eventLocation,
          capacity: formData.eventCapacity ? parseInt(formData.eventCapacity) : undefined,
          price: formData.eventPrice ? {
            amount: parseFloat(formData.eventPrice),
            currency: "EUR",
            isNegotiable: false
          } : undefined,
          isOnline: formData.isOnlineEvent
        } : null,
        
        // Job details
        jobDetails: formData.isJob ? {
          position: formData.jobPosition,
          type: formData.jobType,
          salary: formData.jobSalaryMin || formData.jobSalaryMax ? {
            min: formData.jobSalaryMin ? parseFloat(formData.jobSalaryMin) : undefined,
            max: formData.jobSalaryMax ? parseFloat(formData.jobSalaryMax) : undefined,
            currency: "EUR",
            period: "month"
          } : undefined,
          requirements: formData.jobRequirements,
          applicationDeadline: formData.jobDeadline || undefined
        } : null,
        
        // Property details
        propertyDetails: formData.isProperty ? {
          type: formData.propertyType,
          listingType: formData.propertyListingType,
          price: {
            amount: parseFloat(formData.propertyPrice),
            currency: "EUR",
            isNegotiable: formData.isNegotiable
          },
          size: parseFloat(formData.propertySize),
          rooms: formData.propertyRooms ? parseInt(formData.propertyRooms) : undefined,
          bathrooms: formData.propertyBathrooms ? parseInt(formData.propertyBathrooms) : undefined,
          features: formData.propertyFeatures,
          availableFrom: formData.propertyAvailableFrom || undefined
        } : null,
        
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        engagement: {
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          saves: 0,
          contacts: 0,
          isLiked: false,
          isSaved: false
        },
        isPromoted: formData.isPromoted,
        expiresAt: formData.isPromotion && formData.promotionValidUntil 
          ? new Date(formData.promotionValidUntil).toISOString() 
          : undefined
      }
      
      // Save post
      const updatedPosts = [...(posts || []), newPost]
      setPosts(updatedPosts)
      
      toast.success("Post succesvol aangemaakt!")
      onPostCreated(newPost)
      onClose()
      
    } catch (error) {
      console.error("Error creating post:", error)
      toast.error("Er is een fout opgetreden bij het aanmaken van de post")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={currentUser.avatar} />
            <AvatarFallback>
              {currentUser.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{currentUser.companyName || currentUser.name}</h3>
            <p className="text-sm text-muted-foreground">Nieuwe post maken</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>

      {/* Post Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Type post</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {postTypes.map((type) => (
              <div
                key={type.value}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.type === type.value ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => handleInputChange('type', type.value)}
              >
                <type.icon size={20} className="mb-2" />
                <p className="text-sm font-medium">{type.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Basic Content */}
      <Card>
        <CardHeader>
          <CardTitle>Basis informatie</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titel *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Geef je post een aantrekkelijke titel..."
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">{formData.title.length}/100</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Inhoud *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Beschrijf wat je wilt delen..."
              rows={4}
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground">{formData.content.length}/2000</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Locatie</Label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Waar vindt dit plaats?"
                className="pl-10"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Voeg een tag toe..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1"
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus size={16} />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <X size={12} className="cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Media Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Label htmlFor="media-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted/50">
                  <Camera size={16} />
                  <span className="text-sm">Foto's toevoegen</span>
                </div>
              </Label>
              <Input
                id="media-upload"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleMediaUpload}
                className="hidden"
              />
            </div>
            
            {formData.media.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.media.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      {file.type.startsWith('image/') ? (
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt="Preview" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Video size={24} />
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeMedia(index)}
                    >
                      <X size={12} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Event Details */}
      {formData.type === "event" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} />
              Evenement details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="is-event"
                checked={formData.isEvent}
                onCheckedChange={(checked) => handleInputChange('isEvent', checked)}
              />
              <Label htmlFor="is-event">Dit is een evenement</Label>
            </div>

            {formData.isEvent && (
              <div className="space-y-4 pl-6 border-l-2 border-primary/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Startdatum *</Label>
                    <Input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => handleInputChange('eventDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Starttijd *</Label>
                    <Input
                      type="time"
                      value={formData.eventTime}
                      onChange={(e) => handleInputChange('eventTime', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Einddatum</Label>
                    <Input
                      type="date"
                      value={formData.eventEndDate}
                      onChange={(e) => handleInputChange('eventEndDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Eindtijd</Label>
                    <Input
                      type="time"
                      value={formData.eventEndTime}
                      onChange={(e) => handleInputChange('eventEndTime', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Evenement locatie *</Label>
                  <Input
                    value={formData.eventLocation}
                    onChange={(e) => handleInputChange('eventLocation', e.target.value)}
                    placeholder="Waar vindt het evenement plaats?"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Capaciteit</Label>
                    <Input
                      type="number"
                      value={formData.eventCapacity}
                      onChange={(e) => handleInputChange('eventCapacity', e.target.value)}
                      placeholder="Max aantal personen"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Prijs</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.eventPrice}
                      onChange={(e) => handleInputChange('eventPrice', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is-online-event"
                    checked={formData.isOnlineEvent}
                    onCheckedChange={(checked) => handleInputChange('isOnlineEvent', checked)}
                  />
                  <Label htmlFor="is-online-event">Online evenement</Label>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Annuleren
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Posten..." : "Post publiceren"}
        </Button>
      </div>
    </div>
  )
}