import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CreditCard, 
  TrendUp, 
  ArrowUpRight, 
  ArrowDownRight,
  CurrencyEur,
  Clock,
  Check,
  X,
  Plus,
  Gear,
  Download,
  ArrowClockwise
} from '@phosphor-icons/react'
import { usePayments, useSubscriptions, usePayouts } from '@/hooks/use-payment'
import { paymentService } from '@/services/payment'

interface PaymentDashboardProps {
  businessId: string
}

export function PaymentDashboard({ businessId }: PaymentDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const { 
    transactions, 
    analytics, 
    settings, 
    isLoading: paymentsLoading,
    loadAnalytics 
  } = usePayments(businessId)
  const { currentSubscription } = useSubscriptions(businessId)
  const { payouts } = usePayouts(businessId)

  // Calculate overview metrics
  const totalVolume = analytics?.totalVolume || 0
  const totalTransactions = analytics?.totalTransactions || 0
  const successRate = analytics?.successRate || 0
  const avgTransactionSize = analytics?.averageTransactionSize || 0

  const recentTransactions = transactions.slice(0, 5)
  const pendingPayouts = payouts.filter(p => p.status === 'pending')

  const refreshData = () => {
    loadAnalytics()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Betalingen</h1>
          <p className="text-muted-foreground">
            Beheer je betalingen, abonnementen en uitbetalingen
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refreshData}>
            <ArrowClockwise className="w-4 h-4 mr-2" />
            Vernieuwen
          </Button>
          <Button size="sm" onClick={() => setActiveTab('settings')}>
            <Gear className="w-4 h-4 mr-2" />
            Instellingen
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overzicht</TabsTrigger>
          <TabsTrigger value="transactions">Transacties</TabsTrigger>
          <TabsTrigger value="methods">Betaalmethoden</TabsTrigger>
          <TabsTrigger value="subscription">Abonnement</TabsTrigger>
          <TabsTrigger value="payouts">Uitbetalingen</TabsTrigger>
          <TabsTrigger value="settings">Instellingen</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Totale Omzet</CardTitle>
                <CurrencyEur className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {paymentService.formatAmount(totalVolume)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12% t.o.v. vorige maand
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transacties</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTransactions}</div>
                <p className="text-xs text-muted-foreground">
                  +8% t.o.v. vorige maand
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Slagingspercentage</CardTitle>
                <TrendUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{successRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% t.o.v. vorige maand
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gemiddelde Transactie</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {paymentService.formatAmount(avgTransactionSize)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +5.2% t.o.v. vorige maand
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Transactions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recente Transacties</CardTitle>
                  <CardDescription>
                    Je laatste betalingen en terugbetalingen
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setActiveTab('transactions')}
                >
                  Alle weergeven
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            transaction.status === 'succeeded' ? 'bg-green-500' :
                            transaction.status === 'pending' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`} />
                          <div>
                            <p className="text-sm font-medium">
                              {transaction.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(transaction.createdAt).toLocaleDateString('nl-NL')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {paymentService.formatAmount(transaction.amount)}
                          </p>
                          <Badge variant={
                            transaction.status === 'succeeded' ? 'default' :
                            transaction.status === 'pending' ? 'secondary' :
                            'destructive'
                          } className="text-xs">
                            {transaction.status === 'succeeded' ? 'Succesvol' :
                             transaction.status === 'pending' ? 'In behandeling' :
                             'Mislukt'}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Nog geen transacties
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Subscription Status */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Abonnement Status</CardTitle>
                  <CardDescription>
                    Je huidige abonnement en betalingsstatus
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActiveTab('subscription')}
                >
                  Beheren
                </Button>
              </CardHeader>
              <CardContent>
                {currentSubscription ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Business Plan</p>
                        <p className="text-sm text-muted-foreground">
                          Geldig tot {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString('nl-NL')}
                        </p>
                      </div>
                      <Badge variant={
                        currentSubscription.status === 'active' ? 'default' :
                        currentSubscription.status === 'past_due' ? 'destructive' :
                        'secondary'
                      }>
                        {currentSubscription.status === 'active' ? 'Actief' :
                         currentSubscription.status === 'past_due' ? 'Achterstallig' :
                         'Inactief'}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold">
                      {paymentService.formatAmount(currentSubscription.amount)}/maand
                    </div>
                    {currentSubscription.cancelAtPeriodEnd && (
                      <div className="flex items-center text-amber-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <p className="text-sm">
                          Wordt opgezegd aan het einde van de periode
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Plus className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Geen actief abonnement
                    </p>
                    <Button size="sm" onClick={() => setActiveTab('subscription')}>
                      Plan Kiezen
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Actieve Betaalmethoden</CardTitle>
              <CardDescription>
                Geconfigureerde betaalmethoden voor je klanten
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {settings?.enabledMethods?.map((method) => (
                  <div key={method} className="flex items-center justify-center p-4 border rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl mb-2">
                        {method === 'ideal' ? '🏦' :
                         method === 'creditcard' ? '💳' :
                         method === 'sepa' ? '🏛️' :
                         method === 'bancontact' ? '🇧🇪' :
                         method === 'klarna' ? '🛍️' :
                         method === 'paypal' ? '🅿️' : '💰'}
                      </div>
                      <p className="text-xs font-medium">
                        {method === 'ideal' ? 'iDEAL' :
                         method === 'creditcard' ? 'Credit Card' :
                         method === 'sepa' ? 'SEPA' :
                         method === 'bancontact' ? 'Bancontact' :
                         method === 'klarna' ? 'Klarna' :
                         method === 'paypal' ? 'PayPal' : method}
                      </p>
                    </div>
                  </div>
                )) || (
                  <div className="col-span-full text-center py-6">
                    <p className="text-sm text-muted-foreground">
                      Geen betaalmethoden geconfigureerd
                    </p>
                    <Button 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setActiveTab('methods')}
                    >
                      Toevoegen
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pending Payouts */}
          {pendingPayouts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Openstaande Uitbetalingen</CardTitle>
                <CardDescription>
                  Uitbetalingen die in behandeling zijn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingPayouts.map((payout) => (
                    <div key={payout.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {paymentService.formatAmount(payout.amount)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Verwacht: {new Date(payout.expectedArrival).toLocaleDateString('nl-NL')}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {payout.status === 'pending' ? 'In behandeling' :
                         payout.status === 'in_transit' ? 'Onderweg' : payout.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transacties</CardTitle>
              <CardDescription>Alle betalingen en terugbetalingen</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Transacties overzicht wordt hier getoond...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods">
          <Card>
            <CardHeader>
              <CardTitle>Betaalmethoden</CardTitle>
              <CardDescription>Configureer beschikbare betaalmethoden</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Betaalmethoden configuratie wordt hier getoond...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Abonnement</CardTitle>
              <CardDescription>Beheer je abonnement en facturatie</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Abonnement beheer wordt hier getoond...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts">
          <Card>
            <CardHeader>
              <CardTitle>Uitbetalingen</CardTitle>
              <CardDescription>Bekijk en beheer je uitbetalingen</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Uitbetalingen overzicht wordt hier getoond...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Betalingsinstellingen</CardTitle>
              <CardDescription>Configureer je betalingsinstellingen</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Betalingsinstellingen worden hier getoond...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}