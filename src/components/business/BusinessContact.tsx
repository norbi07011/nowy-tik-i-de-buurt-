import { useState } from "react"
import { useKV } from "@github/spark/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Phone, Mail, MessageSquare, Clock, Globe, QrCode, Share2, Copy } from "lucide-react"

interface ContactInfo {
  phone: string
  email: string
  whatsapp: string
  website: string
  hours: {
    [key: string]: { open: string; close: string; closed: boolean }
  }
  socialMedia: {
    facebook: string
    instagram: string
    linkedin: string
    twitter: string
  }
  autoResponder: {
    enabled: boolean
    message: string
  }
  quickResponses: string[]
}

export function BusinessContact() {
  const [contactInfo, setContactInfo] = useKV<ContactInfo>("business-contact", {
    phone: "+48 123 456 789",
    email: "kontakt@mojafirma.pl",
    whatsapp: "+48 123 456 789",
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
      facebook: "facebook.com/mojafirma",
      instagram: "instagram.com/mojafirma",
      linkedin: "linkedin.com/company/mojafirma",
      twitter: "twitter.com/mojafirma"
    },
    autoResponder: {
      enabled: true,
      message: "Dziękujemy za kontakt! Odpowiemy w ciągu 24 godzin."
    },
    quickResponses: [
      "Dziękujemy za zainteresowanie!",
      "Wycenę prześlemy w ciągu 2 dni roboczych.",
      "Czy moglibyśmy umówić się na konsultację?",
      "Więcej informacji znajdą Państwo na naszej stronie."
    ]
  })

  const [isEditing, setIsEditing] = useState(false)
  const [newQuickResponse, setNewQuickResponse] = useState("")

  const handleSave = () => {
    setIsEditing(false)
  }

  const addQuickResponse = () => {
    if (newQuickResponse.trim() && contactInfo) {
      setContactInfo({
        ...contactInfo,
        quickResponses: [...contactInfo.quickResponses, newQuickResponse.trim()]
      })
      setNewQuickResponse("")
    }
  }

  const removeQuickResponse = (index: number) => {
    if (contactInfo) {
      setContactInfo({
        ...contactInfo,
        quickResponses: contactInfo.quickResponses.filter((_, i) => i !== index)
      })
    }
  }

  const dayNames = {
    monday: "Poniedziałek",
    tuesday: "Wtorek", 
    wednesday: "Środa",
    thursday: "Czwartek",
    friday: "Piątek",
    saturday: "Sobota",
    sunday: "Niedziela"
  }

  const getContactUrl = () => `https://tikbuurt.pl/contact/${encodeURIComponent(contactInfo?.phone || "")}`

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Informacje kontaktowe</h2>
          <p className="text-muted-foreground">Zarządzaj sposobami kontaktu z klientami</p>
        </div>
        <Button 
          variant={isEditing ? "default" : "outline"}
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          {isEditing ? "Zapisz" : "Edytuj"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Basic Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Podstawowe informacje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="phone">Telefon</Label>
              {isEditing ? (
                <Input 
                  id="phone"
                  value={contactInfo?.phone || ""}
                  onChange={(e) => contactInfo && setContactInfo({...contactInfo, phone: e.target.value})}
                />
              ) : (
                <div className="flex items-center mt-1">
                  <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{contactInfo?.phone}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input 
                  id="email"
                  type="email"
                  value={contactInfo?.email || ""}
                  onChange={(e) => contactInfo && setContactInfo({...contactInfo, email: e.target.value})}
                />
              ) : (
                <div className="flex items-center mt-1">
                  <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{contactInfo?.email}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              {isEditing ? (
                <Input 
                  id="whatsapp"
                  value={contactInfo?.whatsapp || ""}
                  onChange={(e) => contactInfo && setContactInfo({...contactInfo, whatsapp: e.target.value})}
                />
              ) : (
                <div className="flex items-center mt-1">
                  <MessageSquare className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{contactInfo?.whatsapp}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="website">Strona internetowa</Label>
              {isEditing ? (
                <Input 
                  id="website"
                  value={contactInfo?.website || ""}
                  onChange={(e) => contactInfo && setContactInfo({...contactInfo, website: e.target.value})}
                />
              ) : (
                <div className="flex items-center mt-1">
                  <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{contactInfo?.website}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Business Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Godziny otwarcia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contactInfo && Object.entries(contactInfo.hours).map(([day, hours]) => (
                <div key={day} className="flex items-center justify-between">
                  <span className="text-sm w-24">{dayNames[day as keyof typeof dayNames]}</span>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={!hours.closed}
                        onCheckedChange={(checked) => setContactInfo({
                          ...contactInfo,
                          hours: {
                            ...contactInfo.hours,
                            [day]: { ...hours, closed: !checked }
                          }
                        })}
                      />
                      {!hours.closed && (
                        <>
                          <Input 
                            type="time"
                            value={hours.open}
                            onChange={(e) => setContactInfo({
                              ...contactInfo,
                              hours: {
                                ...contactInfo.hours,
                                [day]: { ...hours, open: e.target.value }
                              }
                            })}
                            className="w-20"
                          />
                          <span>-</span>
                          <Input 
                            type="time"
                            value={hours.close}
                            onChange={(e) => setContactInfo({
                              ...contactInfo,
                              hours: {
                                ...contactInfo.hours,
                                [day]: { ...hours, close: e.target.value }
                              }
                            })}
                            className="w-20"
                          />
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        {hours.closed ? "Zamknięte" : `${hours.open} - ${hours.close}`}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Media społecznościowe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {contactInfo && Object.entries(contactInfo.socialMedia).map(([platform, url]) => (
              <div key={platform}>
                <Label htmlFor={platform} className="capitalize">{platform}</Label>
                {isEditing ? (
                  <Input 
                    id={platform}
                    value={url}
                    onChange={(e) => setContactInfo({
                      ...contactInfo,
                      socialMedia: {
                        ...contactInfo.socialMedia,
                        [platform]: e.target.value
                      }
                    })}
                    placeholder={`${platform}.com/twojafirma`}
                  />
                ) : (
                  <div className="flex items-center mt-1">
                    <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{url || "Nie ustawiono"}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Auto Responder */}
      <Card>
        <CardHeader>
          <CardTitle>Automatyczne odpowiedzi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              checked={contactInfo?.autoResponder.enabled || false}
              onCheckedChange={(checked) => contactInfo && setContactInfo({
                ...contactInfo,
                autoResponder: { ...contactInfo.autoResponder, enabled: checked }
              })}
            />
            <Label>Włącz automatyczne odpowiedzi</Label>
          </div>

          {contactInfo?.autoResponder.enabled && (
            <div>
              <Label htmlFor="autoMessage">Wiadomość automatyczna</Label>
              <Textarea 
                id="autoMessage"
                value={contactInfo?.autoResponder.message || ""}
                onChange={(e) => contactInfo && setContactInfo({
                  ...contactInfo,
                  autoResponder: { ...contactInfo.autoResponder, message: e.target.value }
                })}
                rows={3}
                placeholder="Dziękujemy za kontakt! Odpowiemy w ciągu 24 godzin."
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Responses */}
      <Card>
        <CardHeader>
          <CardTitle>Szybkie odpowiedzi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {contactInfo?.quickResponses.map((response, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">{response}</span>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => removeQuickResponse(index)}
                >
                  Usuń
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input 
              value={newQuickResponse}
              onChange={(e) => setNewQuickResponse(e.target.value)}
              placeholder="Nowa szybka odpowiedź..."
              onKeyPress={(e) => e.key === 'Enter' && addQuickResponse()}
            />
            <Button onClick={addQuickResponse} disabled={!newQuickResponse.trim()}>
              Dodaj
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contact QR & Share */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Kod QR kontaktowy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg h-40 flex items-center justify-center mb-4">
              <div className="text-center text-muted-foreground">
                <QrCode className="w-16 h-16 mx-auto mb-2" />
                <p className="text-sm">Kod QR z danymi kontaktowymi</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="w-full">
              Pobierz kod QR
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Udostępnij kontakt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Link do kontaktu</Label>
              <div className="flex mt-1">
                <Input 
                  value={getContactUrl()} 
                  readOnly 
                  className="flex-1"
                />
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="ml-2"
                  onClick={() => navigator.clipboard.writeText(getContactUrl())}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <Button className="w-full">
              <Share2 className="w-4 h-4 mr-2" />
              Udostępnij wizytówkę
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}