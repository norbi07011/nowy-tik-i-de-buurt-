import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download,
  ArrowLeft,
  CreditCard
} from '@phosphor-icons/react'
import { PaymentIntent, PaymentStatus } from '@/types/payment'
import { paymentService } from '@/services/payment'

interface PaymentStatusProps {
  paymentIntent: PaymentIntent
  onBack?: () => void
  onDownloadReceipt?: () => void
  className?: string
}

export function PaymentStatusComponent({ 
  paymentIntent, 
  onBack, 
  onDownloadReceipt,
  className 
}: PaymentStatusProps) {
  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle className="w-12 h-12 text-green-500" />
      case 'failed':
        return <XCircle className="w-12 h-12 text-red-500" />
      case 'pending':
      case 'processing':
        return <Clock className="w-12 h-12 text-yellow-500" />
      default:
        return <Clock className="w-12 h-12 text-gray-500" />
    }
  }

  const getStatusTitle = (status: PaymentStatus) => {
    switch (status) {
      case 'succeeded':
        return 'Betaling Succesvol!'
      case 'failed':
        return 'Betaling Mislukt'
      case 'pending':
        return 'Betaling In Behandeling'
      case 'processing':
        return 'Betaling Wordt Verwerkt'
      case 'canceled':
        return 'Betaling Geannuleerd'
      default:
        return 'Betalingsstatus'
    }
  }

  const getStatusDescription = (status: PaymentStatus) => {
    switch (status) {
      case 'succeeded':
        return 'Je betaling is succesvol verwerkt. Je ontvangt een bevestiging per e-mail.'
      case 'failed':
        return 'Er is een probleem opgetreden bij het verwerken van je betaling. Probeer het opnieuw.'
      case 'pending':
        return 'Je betaling wordt momenteel verwerkt. Dit kan enkele minuten duren.'
      case 'processing':
        return 'Je betaling wordt verwerkt. Even geduld alsjeblieft.'
      case 'canceled':
        return 'De betaling is geannuleerd. Er zijn geen kosten in rekening gebracht.'
      default:
        return 'Betalingsstatus wordt bepaald...'
    }
  }

  const getStatusBadgeVariant = (status: PaymentStatus) => {
    switch (status) {
      case 'succeeded':
        return 'default' as const
      case 'failed':
        return 'destructive' as const
      case 'pending':
      case 'processing':
        return 'secondary' as const
      case 'canceled':
        return 'outline' as const
      default:
        return 'secondary' as const
    }
  }

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case 'ideal':
        return 'iDEAL'
      case 'creditcard':
        return 'Credit Card'
      case 'sepa':
        return 'SEPA Incasso'
      case 'bancontact':
        return 'Bancontact'
      case 'sofort':
        return 'SOFORT'
      case 'klarna':
        return 'Klarna'
      case 'paypal':
        return 'PayPal'
      default:
        return method
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          {getStatusIcon(paymentIntent.status)}
        </div>
        <CardTitle className="text-xl">
          {getStatusTitle(paymentIntent.status)}
        </CardTitle>
        <CardDescription>
          {getStatusDescription(paymentIntent.status)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Badge */}
        <div className="flex justify-center">
          <Badge variant={getStatusBadgeVariant(paymentIntent.status)} className="px-3 py-1">
            {paymentIntent.status === 'succeeded' ? 'Succesvol' :
             paymentIntent.status === 'failed' ? 'Mislukt' :
             paymentIntent.status === 'pending' ? 'In behandeling' :
             paymentIntent.status === 'processing' ? 'Verwerken' :
             paymentIntent.status === 'canceled' ? 'Geannuleerd' :
             paymentIntent.status}
          </Badge>
        </div>

        {/* Payment Details */}
        <div className="bg-muted/50 p-4 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Bedrag</span>
            <span className="font-medium">
              {paymentService.formatAmount(paymentIntent.amount)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Betaalmethode</span>
            <span className="font-medium">
              {getPaymentMethodDisplay(paymentIntent.paymentMethod)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Beschrijving</span>
            <span className="font-medium text-right max-w-[200px] truncate">
              {paymentIntent.description}
            </span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Transactie ID</span>
            <span className="font-mono text-xs">
              {paymentIntent.id}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Datum</span>
            <span className="text-sm">
              {new Date(paymentIntent.createdAt).toLocaleString('nl-NL')}
            </span>
          </div>
        </div>

        {/* Customer Details */}
        {paymentIntent.customerDetails && (
          <div className="space-y-3">
            <h3 className="font-medium">Klantgegevens</h3>
            <div className="bg-muted/30 p-3 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Naam</span>
                <span className="text-sm font-medium">
                  {paymentIntent.customerDetails.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">E-mail</span>
                <span className="text-sm font-medium">
                  {paymentIntent.customerDetails.email}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {paymentIntent.status === 'succeeded' && onDownloadReceipt && (
            <Button onClick={onDownloadReceipt} variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Bon
            </Button>
          )}
          
          {paymentIntent.status === 'failed' && (
            <Button onClick={onBack} className="w-full">
              <CreditCard className="w-4 h-4 mr-2" />
              Probeer Opnieuw
            </Button>
          )}
          
          {onBack && (
            <Button onClick={onBack} variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug
            </Button>
          )}
        </div>

        {/* Help Text */}
        {paymentIntent.status === 'failed' && (
          <div className="text-center text-sm text-muted-foreground">
            <p>Hulp nodig? Neem contact op met onze klantenservice.</p>
          </div>
        )}
        
        {paymentIntent.status === 'pending' && (
          <div className="text-center text-sm text-muted-foreground">
            <p>Deze pagina wordt automatisch bijgewerkt wanneer de betaling is verwerkt.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}