import { useState } from "react"
import { useKV } from "@/hooks/use-local-storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Shield, Bell, Eye, Trash, CreditCard } from "@phosphor-icons/react"

interface UserSettingsViewProps {
  user: any
}

export function UserSettingsView({ user }: UserSettingsViewProps) {
  const [users, setUsers] = useKV<any[]>("registered-users", [])
  const [currentUser, setCurrentUser] = useKV<any>("current-user", null)
  const [settings, setSettings] = useState({
    emailNotifications: user.settings?.emailNotifications ?? true,
    pushNotifications: user.settings?.pushNotifications ?? true,
    locationTracking: user.settings?.locationTracking ?? false,
    profileVisibility: user.settings?.profileVisibility ?? true,
    showOnlineStatus: user.settings?.showOnlineStatus ?? true,
    allowMessages: user.settings?.allowMessages ?? true
  })

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    
    // Update user in storage
    const updatedUsers = users?.map((u: any) => 
      u.id === user.id 
        ? { ...u, settings: { ...u.settings, [key]: value } } 
        : u
    ) || []
    
    setUsers(updatedUsers)
    
    // Update current user
    const updatedUser = { 
      ...user, 
      settings: { ...user.settings, [key]: value } 
    }
    setCurrentUser(updatedUser)
    
    toast.success("Ustawienia zostały zapisane")
  }

  const handleDeleteAccount = () => {
    if (confirm("Czy na pewno chcesz usunąć swoje konto? Ta akcja jest nieodwracalna.")) {
      // Remove user from storage
      const updatedUsers = users?.filter((u: any) => u.id !== user.id) || []
      setUsers(updatedUsers)
      setCurrentUser(null)
      toast.success("Konto zostało usunięte")
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Ustawienia</h1>

      {/* Account Type */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard size={20} />
            Typ konta
          </CardTitle>
          <CardDescription>
            Informacje o Twoim koncie
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Konto darmowe</div>
              <div className="text-sm text-muted-foreground">
                Przeglądaj lokalne oferty bez ograniczeń
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Darmowe
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={20} />
            Powiadomienia
          </CardTitle>
          <CardDescription>
            Zarządzaj sposobem otrzymywania powiadomień
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications" className="font-medium">
                Powiadomienia email
              </Label>
              <p className="text-sm text-muted-foreground">
                Otrzymuj powiadomienia o nowych ofertach na email
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications" className="font-medium">
                Powiadomienia push
              </Label>
              <p className="text-sm text-muted-foreground">
                Otrzymuj natychmiastowe powiadomienia w przeglądarce
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={20} />
            Prywatność
          </CardTitle>
          <CardDescription>
            Kontroluj widoczność swojego profilu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="profile-visibility" className="font-medium">
                Publiczny profil
              </Label>
              <p className="text-sm text-muted-foreground">
                Pozwól innym użytkownikom zobaczyć Twój profil
              </p>
            </div>
            <Switch
              id="profile-visibility"
              checked={settings.profileVisibility}
              onCheckedChange={(checked) => handleSettingChange("profileVisibility", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="online-status" className="font-medium">
                Status online
              </Label>
              <p className="text-sm text-muted-foreground">
                Pokaż kiedy jesteś aktywny na platformie
              </p>
            </div>
            <Switch
              id="online-status"
              checked={settings.showOnlineStatus}
              onCheckedChange={(checked) => handleSettingChange("showOnlineStatus", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allow-messages" className="font-medium">
                Wiadomości od firm
              </Label>
              <p className="text-sm text-muted-foreground">
                Pozwól firmom wysyłać Ci wiadomości
              </p>
            </div>
            <Switch
              id="allow-messages"
              checked={settings.allowMessages}
              onCheckedChange={(checked) => handleSettingChange("allowMessages", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="location-tracking" className="font-medium">
                Śledzenie lokalizacji
              </Label>
              <p className="text-sm text-muted-foreground">
                Pokaż oferty blisko Twojej lokalizacji
              </p>
            </div>
            <Switch
              id="location-tracking"
              checked={settings.locationTracking}
              onCheckedChange={(checked) => handleSettingChange("locationTracking", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash size={20} />
            Strefa zagrożenia
          </CardTitle>
          <CardDescription>
            Nieodwracalne akcje dotyczące Twojego konta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Usuń konto</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Po usunięciu konta wszystkie Twoje dane zostaną trwale usunięte. 
                Ta akcja jest nieodwracalna.
              </p>
              <Button 
                variant="destructive" 
                onClick={handleDeleteAccount}
              >
                Usuń moje konto
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}