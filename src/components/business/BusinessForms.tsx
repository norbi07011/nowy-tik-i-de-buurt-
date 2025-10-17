import { useState } from "react"
import { useKV } from "@github/spark/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { File, Mail, MessageSquare, Phone, Settings, Share2, Copy, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

interface ContactForm {
  id: string
  name: string
  type: "contact" | "quote" | "booking" | "custom"
  fields: FormFieldConfig[]
  notifications: {
    email: boolean
    whatsapp: boolean
    emailAddress?: string
    whatsappNumber?: string
  }
  autoReply: {
    enabled: boolean
    message: string
  }
  isActive: boolean
  submissions: number
}

interface FormFieldConfig {
  id: string
  type: "text" | "email" | "phone" | "textarea" | "select" | "checkbox"
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
}

export function BusinessForms() {
  const [forms, setForms] = useKV<ContactForm[]>("business-forms", [
    {
      id: "1",
      name: "Formularz kontaktowy",
      type: "contact",
      fields: [
        { id: "name", type: "text", label: "Imię i nazwisko", required: true },
        { id: "email", type: "email", label: "Email", required: true },
        { id: "phone", type: "phone", label: "Telefon", required: false },
        { id: "message", type: "textarea", label: "Wiadomość", required: true }
      ],
      notifications: {
        email: true,
        whatsapp: false,
        emailAddress: "kontakt@firma.pl"
      },
      autoReply: {
        enabled: true,
        message: "Dziękujemy za kontakt! Odpowiemy w ciągu 24 godzin."
      },
      isActive: true,
      submissions: 47
    },
    {
      id: "2", 
      name: "Zapytanie o wycenę",
      type: "quote",
      fields: [
        { id: "name", type: "text", label: "Nazwa firmy", required: true },
        { id: "contact", type: "text", label: "Osoba kontaktowa", required: true },
        { id: "email", type: "email", label: "Email", required: true },
        { id: "service", type: "select", label: "Rodzaj usługi", required: true, options: ["Usługa A", "Usługa B", "Usługa C"] },
        { id: "description", type: "textarea", label: "Opis projektu", required: true }
      ],
      notifications: {
        email: true,
        whatsapp: true,
        emailAddress: "wyceny@firma.pl",
        whatsappNumber: "+48123456789"
      },
      autoReply: {
        enabled: true,
        message: "Otrzymaliśmy Twoje zapytanie. Wycenę prześlemy w ciągu 2 dni roboczych."
      },
      isActive: true,
      submissions: 23
    }
  ])

  const [selectedForm, setSelectedForm] = useState<ContactForm | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const createNewForm = () => {
    const newForm: ContactForm = {
      id: Date.now().toString(),
      name: "Nowy formularz",
      type: "custom",
      fields: [
        { id: "name", type: "text", label: "Imię i nazwisko", required: true },
        { id: "email", type: "email", label: "Email", required: true }
      ],
      notifications: {
        email: true,
        whatsapp: false
      },
      autoReply: {
        enabled: false,
        message: ""
      },
      isActive: false,
      submissions: 0
    }
    setForms(prev => prev ? [...prev, newForm] : [newForm])
    setSelectedForm(newForm)
    setIsEditing(true)
  }

  const updateForm = (updatedForm: ContactForm) => {
    setForms(prev => prev ? prev.map(form => form.id === updatedForm.id ? updatedForm : form) : [])
    setSelectedForm(updatedForm)
  }

  const deleteForm = (formId: string) => {
    setForms(prev => prev ? prev.filter(form => form.id !== formId) : [])
    if (selectedForm?.id === formId) {
      setSelectedForm(null)
    }
  }

  const getFormEmbedCode = (form: ContactForm) => {
    return `<iframe src="https://tikbuurt.pl/forms/${form.id}" width="100%" height="600"></iframe>`
  }

  const getFormUrl = (form: ContactForm) => {
    return `https://tikbuurt.pl/forms/${form.id}`
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Formularze kontaktowe</h2>
          <p className="text-muted-foreground">Zarządzaj formularzami i zbieraj wiadomości od klientów</p>
        </div>
        <Button onClick={createNewForm}>
          <File className="w-4 h-4 mr-2" />
          Nowy formularz
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Forms List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-semibold">Twoje formularze</h3>
          {forms?.map(form => (
            <Card 
              key={form.id} 
              className={`cursor-pointer transition-colors ${selectedForm?.id === form.id ? 'border-primary' : ''}`}
              onClick={() => setSelectedForm(form)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{form.name}</h4>
                  <Badge variant={form.isActive ? "default" : "secondary"}>
                    {form.isActive ? "Aktywny" : "Nieaktywny"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {form.fields.length} pól
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{form.submissions} zgłoszeń</span>
                  <span className="capitalize">{form.type}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Form Details */}
        <div className="lg:col-span-2">
          {selectedForm ? (
            <div className="space-y-6">
              {/* Form Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedForm.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {selectedForm.submissions} zgłoszeń • {selectedForm.fields.length} pól
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <Settings className="w-4 h-4 mr-1" />
                        {isEditing ? "Anuluj" : "Edytuj"}
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteForm(selectedForm.id)}
                      >
                        Usuń
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="form-name">Nazwa formularza</Label>
                        <Input 
                          id="form-name"
                          value={selectedForm.name}
                          onChange={(e) => updateForm({...selectedForm, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="form-type">Typ formularza</Label>
                        <Select 
                          value={selectedForm.type} 
                          onValueChange={(value) => updateForm({...selectedForm, type: value as any})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="contact">Kontakt</SelectItem>
                            <SelectItem value="quote">Wycena</SelectItem>
                            <SelectItem value="booking">Rezerwacja</SelectItem>
                            <SelectItem value="custom">Niestandardowy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={selectedForm.isActive}
                          onCheckedChange={(checked) => updateForm({...selectedForm, isActive: checked})}
                        />
                        <Label>Formularz aktywny</Label>
                      </div>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-primary/5 rounded-lg">
                        <Mail className="w-8 h-8 text-primary mx-auto mb-2" />
                        <div className="text-2xl font-bold">{selectedForm.submissions}</div>
                        <div className="text-sm text-muted-foreground">Zgłoszenia</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <File className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold">{selectedForm.fields.length}</div>
                        <div className="text-sm text-muted-foreground">Pola</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Powiadomienia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={selectedForm.notifications.email}
                      onCheckedChange={(checked) => updateForm({
                        ...selectedForm, 
                        notifications: {...selectedForm.notifications, email: checked}
                      })}
                    />
                    <Mail className="w-4 h-4" />
                    <Label>Powiadomienia email</Label>
                  </div>
                  
                  {selectedForm.notifications.email && (
                    <div>
                      <Label htmlFor="email-address">Adres email</Label>
                      <Input 
                        id="email-address"
                        type="email"
                        value={selectedForm.notifications.emailAddress || ""}
                        onChange={(e) => updateForm({
                          ...selectedForm,
                          notifications: {...selectedForm.notifications, emailAddress: e.target.value}
                        })}
                        placeholder="email@firma.pl"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={selectedForm.notifications.whatsapp}
                      onCheckedChange={(checked) => updateForm({
                        ...selectedForm,
                        notifications: {...selectedForm.notifications, whatsapp: checked}
                      })}
                    />
                    <MessageSquare className="w-4 h-4" />
                    <Label>Powiadomienia WhatsApp</Label>
                  </div>

                  {selectedForm.notifications.whatsapp && (
                    <div>
                      <Label htmlFor="whatsapp-number">Numer WhatsApp</Label>
                      <Input 
                        id="whatsapp-number"
                        value={selectedForm.notifications.whatsappNumber || ""}
                        onChange={(e) => updateForm({
                          ...selectedForm,
                          notifications: {...selectedForm.notifications, whatsappNumber: e.target.value}
                        })}
                        placeholder="+48123456789"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Embed & Share */}
              <Card>
                <CardHeader>
                  <CardTitle>Udostępnianie</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Link do formularza</Label>
                    <div className="flex mt-1">
                      <Input 
                        value={getFormUrl(selectedForm)} 
                        readOnly 
                        className="flex-1"
                      />
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="ml-2"
                        onClick={() => navigator.clipboard.writeText(getFormUrl(selectedForm))}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="ml-2"
                        onClick={() => window.open(getFormUrl(selectedForm), '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Kod do osadzenia</Label>
                    <Textarea 
                      value={getFormEmbedCode(selectedForm)}
                      readOnly
                      className="mt-1 font-mono text-sm"
                      rows={3}
                    />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => navigator.clipboard.writeText(getFormEmbedCode(selectedForm))}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Kopiuj kod
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <File className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Wybierz formularz</h3>
                <p className="text-muted-foreground mb-4">
                  Wybierz formularz z listy po lewej stronie lub stwórz nowy
                </p>
                <Button onClick={createNewForm}>
                  <File className="w-4 h-4 mr-2" />
                  Stwórz nowy formularz
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}