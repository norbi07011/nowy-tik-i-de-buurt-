import { 
  Gear, 
  Bell, 
  Lock, 
  Globe, 
  Palette, 
  MapPin, 
  Heart, 
  Eye,
  Shield,
  CreditCard,
  Question
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useKV } from "@/hooks/use-local-storage"
import { toast } from "sonner"

type SettingsData = {
  notifications: {
    pushNotifications: boolean
    emailNotifications: boolean
    smsNotifications: boolean
    marketing: boolean
  }
  privacy: {
    profileVisible: boolean
    locationSharing: boolean
    dataCollection: boolean
  }
  appearance: {
    theme: "light" | "dark" | "system"
    language: string
  }
  location: {
    city: string
    country: string
    autoDetect: boolean
  }
}

const defaultSettings: SettingsData = {
  notifications: {
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    marketing: false
  },
  privacy: {
    profileVisible: true,
    locationSharing: true,
    dataCollection: false
  },
  appearance: {
    theme: "system",
    language: "en"
  },
  location: {
    city: "Amsterdam",
    country: "Netherlands",
    autoDetect: true
  }
}

export function SettingsView() {
  const [settings, setSettings] = useKV<SettingsData>("user-settings", defaultSettings)

  const updateSetting = (category: keyof SettingsData, key: string, value: any) => {
    setSettings(current => {
      const currentData = current || defaultSettings
      return {
        ...currentData,
        [category]: {
          ...currentData[category],
          [key]: value
        }
      }
    })
    toast.success("Settings updated")
  }

  const resetToDefaults = () => {
    setSettings(defaultSettings)
    toast.success("Settings reset to defaults")
  }

  const currentSettings = settings || defaultSettings

  return (
    <div className="h-screen bg-background overflow-y-auto">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gear size={24} className="text-primary" weight="fill" />
              <h1 className="text-xl font-bold">Settings</h1>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetToDefaults}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 pb-20 space-y-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell size={20} />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-sm font-medium">Push Notifications</span>
                <p className="text-xs text-muted-foreground">Get notified about activity on your posts</p>
              </div>
              <Switch
                checked={currentSettings.notifications.pushNotifications}
                onCheckedChange={(checked) => updateSetting("notifications", "pushNotifications", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-sm font-medium">Email Notifications</span>
                <p className="text-xs text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch
                checked={currentSettings.notifications.emailNotifications}
                onCheckedChange={(checked) => updateSetting("notifications", "emailNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-sm font-medium">SMS Notifications</span>
                <p className="text-xs text-muted-foreground">Get text messages for important updates</p>
              </div>
              <Switch
                checked={currentSettings.notifications.smsNotifications}
                onCheckedChange={(checked) => updateSetting("notifications", "smsNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-sm font-medium">Marketing Communications</span>
                <p className="text-xs text-muted-foreground">Receive promotional offers and updates</p>
              </div>
              <Switch
                checked={currentSettings.notifications.marketing}
                onCheckedChange={(checked) => updateSetting("notifications", "marketing", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield size={20} />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-sm font-medium">Public Profile</span>
                <p className="text-xs text-muted-foreground">Make your profile visible to other users</p>
              </div>
              <Switch
                checked={currentSettings.privacy.profileVisible}
                onCheckedChange={(checked) => updateSetting("privacy", "profileVisible", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-sm font-medium">Location Sharing</span>
                <p className="text-xs text-muted-foreground">Share your location for better recommendations</p>
              </div>
              <Switch
                checked={currentSettings.privacy.locationSharing}
                onCheckedChange={(checked) => updateSetting("privacy", "locationSharing", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-sm font-medium">Data Collection</span>
                <p className="text-xs text-muted-foreground">Allow analytics for app improvement</p>
              </div>
              <Switch
                checked={currentSettings.privacy.dataCollection}
                onCheckedChange={(checked) => updateSetting("privacy", "dataCollection", checked)}
              />
            </div>

            <Separator />
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Lock size={16} className="mr-2" />
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CreditCard size={16} className="mr-2" />
                Payment Methods
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette size={20} />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Theme</label>
              <Select
                value={currentSettings.appearance.theme}
                onValueChange={(value) => updateSetting("appearance", "theme", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select
                value={currentSettings.appearance.language}
                onValueChange={(value) => updateSetting("appearance", "language", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="nl">Nederlands</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin size={20} />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-sm font-medium">Auto-detect Location</span>
                <p className="text-xs text-muted-foreground">Automatically detect your current location</p>
              </div>
              <Switch
                checked={currentSettings.location.autoDetect}
                onCheckedChange={(checked) => updateSetting("location", "autoDetect", checked)}
              />
            </div>

            {!currentSettings.location.autoDetect && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <Select
                    value={currentSettings.location.city}
                    onValueChange={(value) => updateSetting("location", "city", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Amsterdam">Amsterdam</SelectItem>
                      <SelectItem value="Rotterdam">Rotterdam</SelectItem>
                      <SelectItem value="Utrecht">Utrecht</SelectItem>
                      <SelectItem value="Den Haag">Den Haag</SelectItem>
                      <SelectItem value="Eindhoven">Eindhoven</SelectItem>
                      <SelectItem value="Groningen">Groningen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Country</label>
                  <Select
                    value={currentSettings.location.country}
                    onValueChange={(value) => updateSetting("location", "country", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Netherlands">Netherlands</SelectItem>
                      <SelectItem value="Belgium">Belgium</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="France">France</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Help & Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Question size={20} />
              Help & Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Question size={16} className="mr-2" />
              Help Center
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Shield size={16} className="mr-2" />
              Privacy Policy
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Heart size={16} className="mr-2" />
              Terms of Service
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto">
                <span className="text-primary-foreground font-bold">T</span>
              </div>
              <div>
                <h3 className="font-semibold">Tik in de Buurt</h3>
                <p className="text-sm text-muted-foreground">Version 1.0.0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}