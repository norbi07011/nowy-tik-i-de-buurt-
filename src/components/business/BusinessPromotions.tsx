import { useState } from "react"
import { useKV } from "@/hooks/use-local-storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Target, Percent, Calendar, Users, TrendingUp, Clock, Gift } from "lucide-react"

interface Promotion {
  id: string
  title: string
  description: string
  discount: number
  type: "percentage" | "fixed" | "bogo"
  startDate: string
  endDate: string
  isActive: boolean
  usageCount: number
  maxUsage?: number
  code?: string
  conditions: string
}

export function BusinessPromotions() {
  const [promotions, setPromotions] = useKV<Promotion[]>("business-promotions", [
    {
      id: "1",
      title: "Promocja -35%",
      description: "Rabat na wszystkie usługi przez cały miesiąc",
      discount: 35,
      type: "percentage",
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      isActive: true,
      usageCount: 12,
      maxUsage: 50,
      code: "ZIMA35",
      conditions: "Nie łączy się z innymi promocjami"
    },
    {
      id: "2",
      title: "Pierwszy klient",
      description: "Specjalna oferta dla nowych klientów",
      discount: 20,
      type: "percentage",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      isActive: true,
      usageCount: 8,
      conditions: "Tylko dla nowych klientów"
    }
  ])

  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const createNewPromotion = () => {
    const newPromotion: Promotion = {
      id: Date.now().toString(),
      title: "Nowa promocja",
      description: "",
      discount: 10,
      type: "percentage",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: false,
      usageCount: 0,
      conditions: ""
    }
    setPromotions(prev => prev ? [...prev, newPromotion] : [newPromotion])
    setSelectedPromotion(newPromotion)
    setIsEditing(true)
  }

  const updatePromotion = (updatedPromotion: Promotion) => {
    setPromotions(prev => prev ? prev.map(promo => promo.id === updatedPromotion.id ? updatedPromotion : promo) : [])
    setSelectedPromotion(updatedPromotion)
  }

  const deletePromotion = (promoId: string) => {
    setPromotions(prev => prev ? prev.filter(promo => promo.id !== promoId) : [])
    if (selectedPromotion?.id === promoId) {
      setSelectedPromotion(null)
    }
  }

  const formatDiscount = (promotion: Promotion) => {
    switch (promotion.type) {
      case "percentage":
        return `-${promotion.discount}%`
      case "fixed":
        return `-${promotion.discount} zł`
      case "bogo":
        return "2 za 1"
      default:
        return `-${promotion.discount}%`
    }
  }

  const isPromotionActive = (promotion: Promotion) => {
    const now = new Date()
    const start = new Date(promotion.startDate)
    const end = new Date(promotion.endDate)
    return promotion.isActive && now >= start && now <= end
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Promocje -35%</h2>
          <p className="text-muted-foreground">Zarządzaj promocjami i przyciągnij więcej klientów</p>
        </div>
        <Button onClick={createNewPromotion}>
          <Gift className="w-4 h-4 mr-2" />
          Nowa promocja
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{promotions?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Promocji</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {(promotions || []).filter(p => isPromotionActive(p)).length}
            </div>
            <div className="text-sm text-muted-foreground">Aktywne</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {(promotions || []).reduce((sum, p) => sum + p.usageCount, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Wykorzystań</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round((promotions || []).reduce((sum, p) => sum + p.discount, 0) / Math.max(1, (promotions || []).length))}%
            </div>
            <div className="text-sm text-muted-foreground">Średni rabat</div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Promotions List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-semibold">Twoje promocje</h3>
          {promotions?.map(promotion => (
            <Card 
              key={promotion.id} 
              className={`cursor-pointer transition-colors ${selectedPromotion?.id === promotion.id ? 'border-primary' : ''}`}
              onClick={() => setSelectedPromotion(promotion)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{promotion.title}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant={isPromotionActive(promotion) ? "default" : "secondary"}>
                      {isPromotionActive(promotion) ? "Aktywna" : "Nieaktywna"}
                    </Badge>
                    <Badge variant="outline" className="font-bold">
                      {formatDiscount(promotion)}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {promotion.description}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {promotion.usageCount} użyć
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(promotion.endDate).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Promotion Details */}
        <div className="lg:col-span-2">
          {selectedPromotion ? (
            <div className="space-y-6">
              {/* Promotion Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {selectedPromotion.title}
                        <Badge variant={isPromotionActive(selectedPromotion) ? "default" : "secondary"}>
                          {isPromotionActive(selectedPromotion) ? "Aktywna" : "Nieaktywna"}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Kod: {selectedPromotion.code || "Brak kodu"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? "Anuluj" : "Edytuj"}
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deletePromotion(selectedPromotion.id)}
                      >
                        Usuń
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Tytuł promocji</Label>
                        <Input 
                          id="title"
                          value={selectedPromotion.title}
                          onChange={(e) => updatePromotion({...selectedPromotion, title: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="code">Kod promocyjny</Label>
                        <Input 
                          id="code"
                          value={selectedPromotion.code || ""}
                          onChange={(e) => updatePromotion({...selectedPromotion, code: e.target.value})}
                          placeholder="RABAT20"
                        />
                      </div>
                      <div>
                        <Label htmlFor="discount">Wartość rabatu</Label>
                        <Input 
                          id="discount"
                          type="number"
                          value={selectedPromotion.discount}
                          onChange={(e) => updatePromotion({...selectedPromotion, discount: Number(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxUsage">Maksymalne użycia</Label>
                        <Input 
                          id="maxUsage"
                          type="number"
                          value={selectedPromotion.maxUsage || ""}
                          onChange={(e) => updatePromotion({...selectedPromotion, maxUsage: e.target.value ? Number(e.target.value) : undefined})}
                          placeholder="Bez limitu"
                        />
                      </div>
                      <div>
                        <Label htmlFor="startDate">Data rozpoczęcia</Label>
                        <Input 
                          id="startDate"
                          type="date"
                          value={selectedPromotion.startDate}
                          onChange={(e) => updatePromotion({...selectedPromotion, startDate: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">Data zakończenia</Label>
                        <Input 
                          id="endDate"
                          type="date"
                          value={selectedPromotion.endDate}
                          onChange={(e) => updatePromotion({...selectedPromotion, endDate: e.target.value})}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="description">Opis promocji</Label>
                        <Textarea 
                          id="description"
                          value={selectedPromotion.description}
                          onChange={(e) => updatePromotion({...selectedPromotion, description: e.target.value})}
                          rows={3}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="conditions">Warunki promocji</Label>
                        <Textarea 
                          id="conditions"
                          value={selectedPromotion.conditions}
                          onChange={(e) => updatePromotion({...selectedPromotion, conditions: e.target.value})}
                          rows={2}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-primary/5 rounded-lg">
                          <Percent className="w-8 h-8 text-primary mx-auto mb-2" />
                          <div className="text-2xl font-bold">{formatDiscount(selectedPromotion)}</div>
                          <div className="text-sm text-muted-foreground">Rabat</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold">{selectedPromotion.usageCount}</div>
                          <div className="text-sm text-muted-foreground">
                            z {selectedPromotion.maxUsage || "∞"}
                          </div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <div className="text-xl font-bold">
                            {Math.ceil((new Date(selectedPromotion.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
                          </div>
                          <div className="text-sm text-muted-foreground">dni do końca</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Opis</h4>
                        <p className="text-muted-foreground">{selectedPromotion.description}</p>
                      </div>
                      
                      {selectedPromotion.conditions && (
                        <div>
                          <h4 className="font-medium mb-2">Warunki</h4>
                          <p className="text-sm text-muted-foreground">{selectedPromotion.conditions}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Promotion Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Statystyki promocji</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Wykorzystanie</span>
                      <span className="text-sm font-medium">
                        {selectedPromotion.maxUsage 
                          ? `${selectedPromotion.usageCount}/${selectedPromotion.maxUsage}`
                          : selectedPromotion.usageCount
                        }
                      </span>
                    </div>
                    {selectedPromotion.maxUsage && (
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all" 
                          style={{ width: `${Math.min(100, (selectedPromotion.usageCount / selectedPromotion.maxUsage) * 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Wybierz promocję</h3>
                <p className="text-muted-foreground mb-4">
                  Wybierz promocję z listy po lewej stronie lub stwórz nową
                </p>
                <Button onClick={createNewPromotion}>
                  <Gift className="w-4 h-4 mr-2" />
                  Stwórz nową promocję
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}