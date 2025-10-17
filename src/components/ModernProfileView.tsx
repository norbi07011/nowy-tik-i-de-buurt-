import { useState, useRef } from "react"
import { useKV } from "@/hooks/use-local-storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { 
  Camera, 
  MapPin, 
  Phone, 
  Envelope, 
  PencilSimple, 
  Heart, 
  Star, 
  Users,
  Calendar,
  Gear,
  Shield,
  SignOut,
  X,
  HeartStraight,
  BookmarkSimple,
  Share,
  UserPlus
} from "@phosphor-icons/react"
import { User, BusinessProfile } from "@/types"
import { useSampleBusinesses } from "@/hooks/use-sample-businesses"
import tikLogo from "@/assets/images/tik-logo.svg"

interface ModernProfileViewProps {
  user: User
  onLogout: () => void
}

export function ModernProfileView({ user, onLogout }: ModernProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [users, setUsers] = useKV<User[]>("registered-users", [])
  const [currentUser, setCurrentUser] = useKV<User>("current-user", user)
  const { favoriteBusinesses, setFavoriteBusinesses } = useSampleBusinesses()
  const [savedPosts] = useKV<string[]>("saved-posts", [])
  const [likedPosts] = useKV<string[]>("liked-posts", [])
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phone: user.phone || user.phoneNumber || "",
    city: user.city || user.location || "",
    bio: user.bio || "",
    interests: user.interests || []
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Zdjęcie jest zbyt duże. Maksymalny rozmiar to 5MB.")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string
        const updatedUser = { ...currentUser, profileImage: imageDataUrl, avatar: imageDataUrl }
        setCurrentUser(updatedUser)
        
        // Update in users array
        setUsers((prev) => 
          (prev || []).map((u) => 
            u.id === user.id ? updatedUser : u
          )
        )
        
        toast.success("Zdjęcie profilowe zostało zaktualizowane!")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    const updatedUser = { 
      ...currentUser, 
      ...formData,
      name: `${formData.firstName} ${formData.lastName}`.trim()
    }
    
    setCurrentUser(updatedUser)
    setUsers((prev) => 
      (prev || []).map((u) => 
        u.id === user.id ? updatedUser : u
      )
    )
    
    setIsEditing(false)
    toast.success("Profil został zaktualizowany!")
  }

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || user.phoneNumber || "",
      city: user.city || user.location || "",
      bio: user.bio || "",
      interests: user.interests || []
    })
    setIsEditing(false)
  }

  const removeFavoriteBusiness = (businessId: string) => {
    setFavoriteBusinesses((prev) => 
      (prev || []).filter(business => business.id !== businessId)
    )
    toast.success("Usunięto z ulubionych")
  }

  const addInterest = (interest: string) => {
    if (interest && !formData.interests.includes(interest)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }))
    }
  }

  const removeInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }))
  }

  const stats = {
    saved: savedPosts?.length || 0,
    liked: likedPosts?.length || 0,
    favorites: favoriteBusinesses?.length || 0,
    following: favoriteBusinesses?.length || 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Header with logo */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={tikLogo} alt="Tik in de Buurt" className="w-8 h-8" />
            <h1 className="text-xl font-bold">Mój Profil</h1>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="gap-2">
                <PencilSimple size={16} />
                Edytuj
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  Anuluj
                </Button>
                <Button onClick={handleSave} className="gap-2">
                  <Shield size={16} />
                  Zapisz
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-r from-primary/5 via-background to-accent/5">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
          <CardContent className="relative p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Profile Image */}
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-background shadow-2xl ring-4 ring-primary/20">
                  <AvatarImage 
                    src={currentUser.profileImage || currentUser.avatar} 
                    className="object-cover"
                  />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                    {(currentUser.firstName?.[0] || currentUser.name?.[0] || "U")}
                    {(currentUser.lastName?.[0] || "")}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 shadow-lg hover:scale-105 transition-transform"
                  >
                    <Camera size={16} />
                  </Button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {currentUser.firstName && currentUser.lastName 
                      ? `${currentUser.firstName} ${currentUser.lastName}`
                      : currentUser.name
                    }
                  </h2>
                  <p className="text-muted-foreground text-lg">{currentUser.bio}</p>
                </div>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                  {currentUser.city && (
                    <div className="flex items-center gap-1">
                      <MapPin size={16} className="text-primary" />
                      {currentUser.city}
                    </div>
                  )}
                  {currentUser.email && (
                    <div className="flex items-center gap-1">
                      <Envelope size={16} className="text-primary" />
                      {currentUser.email}
                    </div>
                  )}
                  {currentUser.phone && (
                    <div className="flex items-center gap-1">
                      <Phone size={16} className="text-primary" />
                      {currentUser.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar size={16} className="text-primary" />
                    Dołączył {new Date(currentUser.createdAt).toLocaleDateString('pl-PL')}
                  </div>
                </div>

                {/* Interests */}
                {currentUser.interests && currentUser.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {currentUser.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.saved}</div>
                  <div className="text-xs text-muted-foreground">Zapisane</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{stats.liked}</div>
                  <div className="text-xs text-muted-foreground">Polubienia</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">{stats.favorites}</div>
                  <div className="text-xs text-muted-foreground">Ulubione</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-foreground">{stats.following}</div>
                  <div className="text-xs text-muted-foreground">Obserwowane</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gear size={20} className="text-primary" />
                  Informacje osobiste
                </CardTitle>
                <CardDescription>
                  Zarządzaj swoimi danymi osobowymi i preferencjami
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Imię</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      disabled={!isEditing}
                      className="transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nazwisko</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      disabled={!isEditing}
                      className="transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                    className="transition-all duration-200"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      className="transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Miasto</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      disabled={!isEditing}
                      className="transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Opowiedz coś o sobie..."
                    className="min-h-[100px] transition-all duration-200"
                  />
                </div>

                {/* Interests Management */}
                <div className="space-y-3">
                  <Label>Zainteresowania</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.interests.map((interest, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-sm gap-1 hover:bg-destructive/10 transition-colors"
                      >
                        {interest}
                        {isEditing && (
                          <button
                            onClick={() => removeInterest(interest)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Dodaj zainteresowanie..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addInterest(e.currentTarget.value)
                            e.currentTarget.value = ''
                          }
                        }}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement
                          addInterest(input.value)
                          input.value = ''
                        }}
                      >
                        Dodaj
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Favorite Businesses */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart size={20} className="text-primary" weight="fill" />
                  Ulubieni sprzedawcy ({favoriteBusinesses?.length || 0})
                </CardTitle>
                <CardDescription>
                  Firmy, które lubisz i chcesz śledzić
                </CardDescription>
              </CardHeader>
              <CardContent>
                {favoriteBusinesses && favoriteBusinesses.length > 0 ? (
                  <div className="grid gap-4">
                    {favoriteBusinesses.map((business) => (
                      <div key={business.id} className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={business.gallery?.[0]?.url} />
                          <AvatarFallback>
                            {business.businessName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{business.businessName}</h4>
                          <p className="text-sm text-muted-foreground truncate">{business.category}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star size={12} weight="fill" className="text-yellow-500" />
                            <span className="text-xs text-muted-foreground">
                              {business.rating} ({business.reviewCount} opinii)
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFavoriteBusiness(business.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <HeartStraight size={16} />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Heart size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Nie masz jeszcze ulubionych sprzedawców</p>
                    <p className="text-sm">Dodaj firmy do ulubionych, aby je tu zobaczyć</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="text-lg">Szybkie akcje</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2 hover-lift">
                  <BookmarkSimple size={16} />
                  Zapisane posty
                  <Badge variant="secondary" className="ml-auto">{stats.saved}</Badge>
                </Button>
                
                <Button variant="outline" className="w-full justify-start gap-2 hover-lift">
                  <HeartStraight size={16} />
                  Polubione
                  <Badge variant="secondary" className="ml-auto">{stats.liked}</Badge>
                </Button>
                
                <Button variant="outline" className="w-full justify-start gap-2 hover-lift">
                  <Users size={16} />
                  Obserwowane firmy
                  <Badge variant="secondary" className="ml-auto">{stats.following}</Badge>
                </Button>
                
                <Separator />
                
                <Button variant="outline" className="w-full justify-start gap-2 hover-lift">
                  <Gear size={16} />
                  Ustawienia
                </Button>
                
                <Button 
                  variant="destructive" 
                  className="w-full justify-start gap-2"
                  onClick={onLogout}
                >
                  <SignOut size={16} />
                  Wyloguj się
                </Button>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="text-lg">Informacje o koncie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={currentUser.isVerified ? "default" : "secondary"}>
                    {currentUser.isVerified ? "Zweryfikowany" : "Niezweryfikowany"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Typ konta</span>
                  <Badge variant="outline">
                    {currentUser.accountType === 'business' ? 'Biznes' : 'Osobiste'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Język</span>
                  <Badge variant="outline">
                    {currentUser?.language === 'nl' ? 'Nederlands' : 'English'}
                  </Badge>
                </div>

                <Separator />

                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Członek od {new Date(currentUser.createdAt).toLocaleDateString('pl-PL')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}