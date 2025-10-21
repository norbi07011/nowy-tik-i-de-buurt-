import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Camera, MapPin, Phone, Envelope } from "@phosphor-icons/react"
import { useAuth } from "@/contexts/AppContext"

interface UserProfileViewProps {
  user: any
}

export function UserProfileView({ user }: UserProfileViewProps) {
  const { setCurrentUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    city: user.city || "",
    bio: user.bio || ""
  })

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
          console.log('✅ Profile updated in localStorage')
        }
      }

      // Update current user in context
      const updatedUser = { ...user, ...formData }
      setCurrentUser(updatedUser)

      setIsEditing(false)
      toast.success("Profil został zaktualizowany")
    } catch (error) {
      console.error('❌ Save error:', error)
      toast.error("Błąd podczas zapisywania")
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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mój profil</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            Edytuj profil
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Anuluj
            </Button>
            <Button onClick={handleSave}>
              Zapisz zmiany
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Image and Basic Info */}
        <Card>
          <CardContent className="p-6 text-center">
            <div className="relative mb-4">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src={user.profileImage} />
                <AvatarFallback className="text-2xl">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2 rounded-full w-8 h-8 p-0"
                >
                  <Camera size={16} />
                </Button>
              )}
            </div>
            
            <h2 className="text-xl font-semibold">
              {user.name}
            </h2>
            <p className="text-muted-foreground flex items-center justify-center gap-1">
              <MapPin size={16} />
              {user.city || 'Brak lokalizacji'}
            </p>
            
            <Separator className="my-4" />
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Envelope size={16} />
                {user.email}
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Phone size={16} />
                {user.phone}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informacje osobiste</CardTitle>
              <CardDescription>
                Zarządzaj swoimi danymi osobowymi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Imię i Nazwisko</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Miasto</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statystyki</CardTitle>
              <CardDescription>
                Twoja aktywność na platformie
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">12</div>
                  <div className="text-sm text-muted-foreground">Zapisane</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">28</div>
                  <div className="text-sm text-muted-foreground">Polubienia</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">5</div>
                  <div className="text-sm text-muted-foreground">Wiadomości</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}