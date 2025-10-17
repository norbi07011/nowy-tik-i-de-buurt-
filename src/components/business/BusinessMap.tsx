import { useState } from "react"
import { useKV } from "@/hooks/use-local-storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Navigation, Phone, Clock, Car, Bus } from "lucide-react"

interface BusinessLocation {
  name: string
  address: string
  latitude: number
  longitude: number
  phone: string
  hours: string
  parkingInfo: string
  publicTransport: string
}

export function BusinessMap() {
  const [location, setLocation] = useKV<BusinessLocation>("business-location", {
    name: "Moja Firma",
    address: "ul. Przykładowa 123, 00-000 Miasto",
    latitude: 52.2297,
    longitude: 21.0122,
    phone: "+48 123 456 789",
    hours: "Pon-Pt: 9:00-17:00, Sob: 10:00-14:00",
    parkingInfo: "Bezpłatny parking dla klientów",
    publicTransport: "Autobus 123, 456 - przystanek Przykładowa"
  })

  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Lokalizacja firmy</h2>
          <p className="text-muted-foreground">Zarządzaj informacjami o lokalizacji</p>
        </div>
        <Button 
          variant={isEditing ? "default" : "outline"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Zapisz" : "Edytuj"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Map Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Mapa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-2" />
                <p>Podgląd mapy</p>
                <p className="text-sm">Integracja z Google Maps</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm">
                <Navigation className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>{location?.address}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Navigation className="w-4 h-4 mr-1" />
                  Nawiguj
                </Button>
                <Button size="sm" variant="outline">
                  Udostępnij lokalizację
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Details */}
        <Card>
          <CardHeader>
            <CardTitle>Szczegóły lokalizacji</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Adres</Label>
              {isEditing ? (
                <Input 
                  id="address"
                  value={location?.address || ""}
                  onChange={(e) => setLocation(prev => prev ? {...prev, address: e.target.value} : null)}
                />
              ) : (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{location?.address}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              {isEditing ? (
                <Input 
                  id="phone"
                  value={location?.phone || ""}
                  onChange={(e) => setLocation(prev => prev ? {...prev, phone: e.target.value} : null)}
                />
              ) : (
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{location?.phone}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">Godziny otwarcia</Label>
              {isEditing ? (
                <Input 
                  id="hours"
                  value={location?.hours || ""}
                  onChange={(e) => setLocation(prev => prev ? {...prev, hours: e.target.value} : null)}
                />
              ) : (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{location?.hours}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="parking">Informacje o parkingu</Label>
              {isEditing ? (
                <Input 
                  id="parking"
                  value={location?.parkingInfo || ""}
                  onChange={(e) => setLocation(prev => prev ? {...prev, parkingInfo: e.target.value} : null)}
                />
              ) : (
                <div className="flex items-center">
                  <Car className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{location?.parkingInfo}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="transport">Transport publiczny</Label>
              {isEditing ? (
                <Input 
                  id="transport"
                  value={location?.publicTransport || ""}
                  onChange={(e) => setLocation(prev => prev ? {...prev, publicTransport: e.target.value} : null)}
                />
              ) : (
                <div className="flex items-center">
                  <Bus className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{location?.publicTransport}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QR Code and Integration */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Kod QR lokalizacji</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg h-40 flex items-center justify-center mb-4">
              <div className="text-center text-muted-foreground">
                <div className="w-16 h-16 mx-auto mb-2 bg-black/10 rounded"></div>
                <p className="text-sm">Kod QR z lokalizacją</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Klienci mogą zeskanować kod QR, aby otrzymać nawigację do Twojej firmy
            </p>
            <Button size="sm" variant="outline" className="w-full">
              Pobierz kod QR
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integracje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Google My Business</span>
              <Button size="sm" variant="outline">Połącz</Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Apple Maps</span>
              <Button size="sm" variant="outline">Połącz</Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Waze</span>
              <Button size="sm" variant="outline">Połącz</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}