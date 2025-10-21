import { useState, useRef } from "react"
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
import { useAuth } from "@/contexts/AppContext"
import tikLogo from "@/assets/images/tik-logo.svg"

interface ModernProfileViewProps {
  user: User
  onLogout: () => void
}

export function ModernProfileView({ user, onLogout }: ModernProfileViewProps) {
  const { setCurrentUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    city: user.city || "",
    bio: user.bio || ""
  })

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Zdjęcie jest zbyt duże. Maksymalny rozmiar to 5MB.")
      return
    }

    try {
      console.log('📤 Uploading profile image...')
      // For now, just create a local URL
      const imageUrl = URL.createObjectURL(file)
      
      // Update user in localStorage
      const storedUsers = localStorage.getItem('registered-users')
      if (storedUsers) {
        const users = JSON.parse(storedUsers)
        const userIndex = users.findIndex((u: any) => u.id === user.id)
        if (userIndex !== -1) {
          users[userIndex].profileImage = imageUrl
          localStorage.setItem('registered-users', JSON.stringify(users))
        }
      }

      setCurrentUser({ ...user, profileImage: imageUrl })
      toast.success("Zdjęcie profilowe zostało zaktualizowane!")
    } catch (error) {
      console.error('❌ Image upload error:', error)
      toast.error('Błąd podczas przesyłania zdjęcia')
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      console.log('💾 Saving profile to localStorage...', formData)

      // Update user in localStorage
      const storedUsers = localStorage.getItem('registered-users')
      if (storedUsers) {
        const users = JSON.parse(storedUsers)
        const userIndex = users.findIndex((u: any) => u.id === user.id)
        
        if (userIndex !== -1) {
          users[userIndex] = {
            ...users[userIndex],
            name: formData.name,
            phone: formData.phone,
            city: formData.city,
            bio: formData.bio
          }
          localStorage.setItem('registered-users', JSON.stringify(users))
        }
      }

      const updatedUser = { ...user, ...formData }
      setCurrentUser(updatedUser)
      setIsEditing(false)
      toast.success("Profil został zaktualizowany!")
    } catch (error) {
      console.error('❌ Save error:', error)
      toast.error('Błąd podczas zapisywania')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      city: user.city || "",
      bio: user.bio || ""
    })
    setIsEditing(false)
  }

  const stats = {
    saved: 0,
    liked: 0,
    favorites: 0,
    following: 0
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
                    src={user.profileImage || user.avatar} 
                    className="object-cover"
                  />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                    {(user.firstName?.[0] || user.name?.[0] || "U")}
                    {(user.lastName?.[0] || "")}
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
                    {user.firstName && user.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user.name
                    }
                  </h2>
                  <p className="text-muted-foreground text-lg">{user.bio}</p>
                </div>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                  {user.city && (
                    <div className="flex items-center gap-1">
                      <MapPin size={16} className="text-primary" />
                      {user.city}
                    </div>
                  )}
                  {user.email && (
                    <div className="flex items-center gap-1">
                      <Envelope size={16} className="text-primary" />
                      {user.email}
                    </div>
                  )}
                  {user.phone && (
                    <div className="flex items-center gap-1">
                      <Phone size={16} className="text-primary" />
                      {user.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar size={16} className="text-primary" />
                    Dołączył {new Date(user.createdAt).toLocaleDateString('pl-PL')}
                  </div>
                </div>

                {/* Interests */}
                {user.interests && user.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest, index) => (
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
                  <Badge variant={user.isVerified ? "default" : "secondary"}>
                    {user.isVerified ? "Zweryfikowany" : "Niezweryfikowany"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Typ konta</span>
                  <Badge variant="outline">
                    {user.accountType === 'business' ? 'Biznes' : 'Osobiste'}
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
                    Członek od {new Date(user.createdAt).toLocaleDateString('pl-PL')}
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
