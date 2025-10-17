import { useState, useEffect } from "react"
import { useKV } from "@github/spark/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Calendar, TrendUp, Users, Target, Play, Pause, PencilSimple, Trash, ChartBar, Eye } from "@phosphor-icons/react"
import { toast } from "sonner"

interface Campaign {
  id: string
  title: string
  type: 'promotion' | 'event' | 'announcement' | 'job_posting'
  status: 'draft' | 'active' | 'paused' | 'completed'
  startDate: string
  endDate: string
  budget: number
  spent: number
  metrics: {
    impressions: number
    clicks: number
    conversions: number
    ctr: number
    cost_per_click: number
  }
  content: {
    title: string
    description: string
    imageUrl?: string
    callToAction: string
  }
  targetAudience: {
    location?: string
    ageRange?: [number, number]
    interests?: string[]
  }
  createdAt: string
}

export function MarketingCenter({ businessId }: { businessId: string }) {
  const [campaigns, setCampaigns] = useKV<Campaign[]>(`marketing-campaigns-${businessId}`, [])
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    type: 'promotion' as Campaign['type'],
    description: '',
    budget: 50,
    startDate: '',
    endDate: '',
    callToAction: '',
    location: '',
    ageRange: [18, 65] as [number, number],
    interests: [] as string[]
  })

  const [analytics, setAnalytics] = useKV<{
    totalImpressions: number
    totalClicks: number
    totalSpend: number
    averageCTR: number
    totalConversions: number
  }>(`marketing-analytics-${businessId}`, {
    totalImpressions: 15420,
    totalClicks: 892,
    totalSpend: 245.50,
    averageCTR: 5.8,
    totalConversions: 127
  })

  useEffect(() => {
    // Initialize with sample campaigns if empty
    if ((campaigns || []).length === 0) {
      const sampleCampaigns: Campaign[] = [
        {
          id: 'camp-1',
          title: 'Zomer Promotie 2024',
          type: 'promotion',
          status: 'active',
          startDate: '2024-06-01',
          endDate: '2024-08-31',
          budget: 200,
          spent: 125.50,
          metrics: {
            impressions: 8520,
            clicks: 456,
            conversions: 67,
            ctr: 5.4,
            cost_per_click: 0.28
          },
          content: {
            title: '20% Korting op Zomerproducten',
            description: 'Profiteer nu van onze geweldige zomerkorting op alle seizoensproducten!',
            callToAction: 'Bekijk Aanbiedingen'
          },
          targetAudience: {
            location: 'Amsterdam',
            ageRange: [25, 55],
            interests: ['shopping', 'lifestyle']
          },
          createdAt: '2024-05-15T10:00:00Z'
        },
        {
          id: 'camp-2',
          title: 'Nieuw Product Launch',
          type: 'announcement',
          status: 'draft',
          startDate: '2024-07-01',
          endDate: '2024-07-15',
          budget: 150,
          spent: 0,
          metrics: {
            impressions: 0,
            clicks: 0,
            conversions: 0,
            ctr: 0,
            cost_per_click: 0
          },
          content: {
            title: 'Introductie van Ons Nieuwste Product',
            description: 'Ontdek ons revolutionaire nieuwe product dat uw leven zal veranderen.',
            callToAction: 'Meer Informatie'
          },
          targetAudience: {
            location: 'Nederland',
            ageRange: [30, 60],
            interests: ['innovation', 'technology']
          },
          createdAt: '2024-06-01T14:30:00Z'
        }
      ]
      setCampaigns(sampleCampaigns)
    }
  }, [campaigns, setCampaigns])

  const handleCreateCampaign = () => {
    if (!newCampaign.title || !newCampaign.description || !newCampaign.startDate || !newCampaign.endDate) {
      toast.error("Vul alle verplichte velden in")
      return
    }

    const campaign: Campaign = {
      id: `camp-${Date.now()}`,
      title: newCampaign.title,
      type: newCampaign.type,
      status: 'draft',
      startDate: newCampaign.startDate,
      endDate: newCampaign.endDate,
      budget: newCampaign.budget,
      spent: 0,
      metrics: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        cost_per_click: 0
      },
      content: {
        title: newCampaign.title,
        description: newCampaign.description,
        callToAction: newCampaign.callToAction || 'Meer Info'
      },
      targetAudience: {
        location: newCampaign.location,
        ageRange: newCampaign.ageRange,
        interests: newCampaign.interests
      },
      createdAt: new Date().toISOString()
    }

    setCampaigns(current => [...(current || []), campaign])
    setShowCreateDialog(false)
    setNewCampaign({
      title: '',
      type: 'promotion',
      description: '',
      budget: 50,
      startDate: '',
      endDate: '',
      callToAction: '',
      location: '',
      ageRange: [18, 65],
      interests: []
    })
    toast.success("Campagne succesvol aangemaakt")
  }

  const toggleCampaignStatus = (campaignId: string) => {
    setCampaigns(current =>
      (current || []).map(campaign => {
        if (campaign.id === campaignId) {
          const newStatus = campaign.status === 'active' ? 'paused' : 'active'
          return { ...campaign, status: newStatus }
        }
        return campaign
      })
    )
  }

  const deleteCampaign = (campaignId: string) => {
    setCampaigns(current => (current || []).filter(c => c.id !== campaignId))
    toast.success("Campagne verwijderd")
  }

  const getStatusBadge = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actief</Badge>
      case 'paused':
        return <Badge variant="secondary">Gepauzeerd</Badge>
      case 'draft':
        return <Badge variant="outline">Concept</Badge>
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Voltooid</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeLabel = (type: Campaign['type']) => {
    switch (type) {
      case 'promotion':
        return 'Promotie'
      case 'event':
        return 'Evenement'
      case 'announcement':
        return 'Aankondiging'
      case 'job_posting':
        return 'Vacature'
      default:
        return type
    }
  }

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Impressies</p>
                <p className="text-2xl font-bold">{analytics?.totalImpressions.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Clicks</p>
                <p className="text-2xl font-bold">{analytics?.totalClicks}</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Uitgegeven</p>
                <p className="text-2xl font-bold">€{analytics?.totalSpend.toFixed(2)}</p>
              </div>
              <TrendUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CTR</p>
                <p className="text-2xl font-bold">{analytics?.averageCTR}%</p>
              </div>
              <ChartBar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversies</p>
                <p className="text-2xl font-bold">{analytics?.totalConversions}</p>
              </div>
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="campaigns">Campagnes</TabsTrigger>
            <TabsTrigger value="templates">Sjablonen</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>Nieuwe Campagne</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nieuwe Marketing Campagne</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="campaign-title">Titel *</Label>
                    <Input
                      id="campaign-title"
                      value={newCampaign.title}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Bijv. Zomer Promotie 2024"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="campaign-type">Type *</Label>
                    <Select value={newCampaign.type} onValueChange={(value: Campaign['type']) => setNewCampaign(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="promotion">Promotie</SelectItem>
                        <SelectItem value="event">Evenement</SelectItem>
                        <SelectItem value="announcement">Aankondiging</SelectItem>
                        <SelectItem value="job_posting">Vacature</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="campaign-description">Beschrijving *</Label>
                  <Textarea
                    id="campaign-description"
                    value={newCampaign.description}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Beschrijf uw campagne..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="campaign-budget">Budget (€)</Label>
                    <Input
                      id="campaign-budget"
                      type="number"
                      value={newCampaign.budget}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, budget: Number(e.target.value) }))}
                      min="10"
                      max="10000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="campaign-start">Startdatum *</Label>
                    <Input
                      id="campaign-start"
                      type="date"
                      value={newCampaign.startDate}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="campaign-end">Einddatum *</Label>
                    <Input
                      id="campaign-end"
                      type="date"
                      value={newCampaign.endDate}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="campaign-cta">Call-to-Action</Label>
                  <Input
                    id="campaign-cta"
                    value={newCampaign.callToAction}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, callToAction: e.target.value }))}
                    placeholder="Bijv. Bekijk Aanbiedingen, Meer Info"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="campaign-location">Doellocatie</Label>
                  <Input
                    id="campaign-location"
                    value={newCampaign.location}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Bijv. Amsterdam, Nederland"
                  />
                </div>

                <Button onClick={handleCreateCampaign} className="w-full">
                  Campagne Aanmaken
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid gap-4">
            {(campaigns || []).map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{campaign.title}</CardTitle>
                      {getStatusBadge(campaign.status)}
                      <Badge variant="outline">{getTypeLabel(campaign.type)}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleCampaignStatus(campaign.id)}
                      >
                        {campaign.status === 'active' ? (
                          <>
                            <Pause className="h-4 w-4 mr-1" />
                            Pauzeren
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            Starten
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        <PencilSimple className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteCampaign(campaign.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                      <p className="text-muted-foreground">{campaign.content.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {campaign.startDate} - {campaign.endDate}
                        </div>
                        {campaign.targetAudience.location && (
                          <span>📍 {campaign.targetAudience.location}</span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Budget voortgang</span>
                          <span>€{campaign.spent} / €{campaign.budget}</span>
                        </div>
                        <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold">{campaign.metrics.impressions.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Impressies</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{campaign.metrics.clicks}</p>
                          <p className="text-xs text-muted-foreground">Clicks</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-lg font-semibold">{campaign.metrics.ctr.toFixed(1)}%</p>
                          <p className="text-xs text-muted-foreground">CTR</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold">{campaign.metrics.conversions}</p>
                          <p className="text-xs text-muted-foreground">Conversies</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campagne Sjablonen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Voorgedefinieerde sjablonen voor verschillende campagnetypes komen binnenkort beschikbaar.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gedetailleerde Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Uitgebreide analytics en rapportage functies zijn in ontwikkeling.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}