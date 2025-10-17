import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  CreditCard, 
  Lock, 
  ShieldCheck,
  Check,
  X
} from '@phosphor-icons/react'
import { usePaymentProcessing, usePaymentMethodConfigs } from '@/hooks/use-payment'
import { DutchPaymentMethod } from '@/types/payment'
import { paymentService } from '@/services/payment'

const checkoutSchema = z.object({
  paymentMethod: z.string().min(1, 'Selecteer een betaalmethode'),
  email: z.string().email('Ongeldig e-mailadres'),
  
  // Method-specific fields
  idealBank: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  cardHolderName: z.string().optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

interface PaymentCheckoutProps {
  businessId: string
  amount: number
  currency?: string
  description: string
  customerEmail?: string
  onSuccess?: (result: any) => void
  onError?: (error: string) => void
  className?: string
}

export function PaymentCheckout({
  businessId,
  amount,
  currency = 'EUR',
  description,
  customerEmail,
  onSuccess,
  onError,
  className
}: PaymentCheckoutProps) {
  const [selectedMethod, setSelectedMethod] = useState<DutchPaymentMethod | null>(null)
  const [idealBanks, setIdealBanks] = useState<any[]>([])
  
  const { createPaymentIntent, confirmPaymentIntent, isProcessing, error } = usePaymentProcessing()
  const { getEnabledConfigs, getConfigByMethod } = usePaymentMethodConfigs()
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: customerEmail || ''
    }
  })

  const watchedMethod = watch('paymentMethod')

  // Load iDEAL banks when iDEAL is selected
  React.useEffect(() => {
    if (selectedMethod === 'ideal') {
      paymentService.getIdealBanks().then(response => {
        if (response.success && response.data) {
          setIdealBanks(response.data)
        }
      })
    }
  }, [selectedMethod])

  React.useEffect(() => {
    setSelectedMethod(watchedMethod as DutchPaymentMethod)
  }, [watchedMethod])

  const enabledMethods = getEnabledConfigs()
  const selectedConfig = selectedMethod ? getConfigByMethod(selectedMethod) : null

  const calculateFee = (amount: number, method: DutchPaymentMethod) => {
    const config = getConfigByMethod(method)
    if (!config) return 0
    return (amount * config.processingFee) / 100
  }

  const totalAmount = selectedMethod ? amount + calculateFee(amount, selectedMethod) : amount

  const onSubmit = async (data: CheckoutFormData) => {
    if (!selectedMethod) return

    try {
      // Create payment intent
      const paymentIntent = await createPaymentIntent({
        amount: Math.round(totalAmount * 100), // Convert to cents
        currency,
        paymentMethod: selectedMethod,
        description,
        businessId,
        customerDetails: {
          name: 'Klant', // In real app, would get from form
          email: data.email
        }
      })

      if (!paymentIntent) return

      // Prepare payment method data
      let paymentMethodData: any = {}

      if (selectedMethod === 'ideal' && data.idealBank) {
        paymentMethodData.ideal = { bank: data.idealBank }
      } else if (selectedMethod === 'creditcard') {
        paymentMethodData.card = {
          number: data.cardNumber,
          expiryMonth: parseInt(data.cardExpiry?.split('/')[0] || ''),
          expiryYear: parseInt(data.cardExpiry?.split('/')[1] || ''),
          cvc: data.cardCvc,
          holderName: data.cardHolderName
        }
      }

      // Confirm payment intent
      const result = await confirmPaymentIntent(paymentIntent.id, paymentMethodData)
      
      if (result && onSuccess) {
        onSuccess(result)
      }
    } catch (err) {
      console.error('Payment error:', err)
      if (onError) {
        onError('Er is een fout opgetreden bij het verwerken van de betaling')
      }
    }
  }

  const renderMethodSpecificFields = () => {
    if (!selectedMethod) return null

    switch (selectedMethod) {
      case 'ideal':
        return (
          <div className="space-y-3">
            <Label htmlFor="idealBank">Selecteer je bank</Label>
            <Select onValueChange={(value) => setValue('idealBank', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Kies je bank" />
              </SelectTrigger>
              <SelectContent>
                {idealBanks.map((bank) => (
                  <SelectItem key={bank.id} value={bank.id}>
                    {bank.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case 'creditcard':
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="cardHolderName">Naam op kaart</Label>
              <Input
                {...register('cardHolderName')}
                placeholder="J. de Vries"
              />
              {errors.cardHolderName && (
                <p className="text-xs text-destructive mt-1">{errors.cardHolderName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="cardNumber">Kaartnummer</Label>
              <Input
                {...register('cardNumber')}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              {errors.cardNumber && (
                <p className="text-xs text-destructive mt-1">{errors.cardNumber.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="cardExpiry">MM/YY</Label>
                <Input
                  {...register('cardExpiry')}
                  placeholder="12/28"
                  maxLength={5}
                />
                {errors.cardExpiry && (
                  <p className="text-xs text-destructive mt-1">{errors.cardExpiry.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="cardCvc">CVC</Label>
                <Input
                  {...register('cardCvc')}
                  placeholder="123"
                  maxLength={4}
                />
                {errors.cardCvc && (
                  <p className="text-xs text-destructive mt-1">{errors.cardCvc.message}</p>
                )}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Betaling</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Order Summary */}
          <div className="bg-muted/50 p-3 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotaal</span>
              <span>{paymentService.formatAmount(amount)}</span>
            </div>
            {selectedMethod && (
              <>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Transactiekosten</span>
                  <span>+{paymentService.formatAmount(calculateFee(amount, selectedMethod))}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Totaal</span>
                  <span>{paymentService.formatAmount(totalAmount)}</span>
                </div>
              </>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">E-mailadres</Label>
            <Input
              type="email"
              {...register('email')}
              placeholder="je@email.com"
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <Label>Betaalmethode</Label>
            <div className="grid gap-2">
              {enabledMethods.map((config) => (
                <label key={config.method} className="cursor-pointer">
                  <input
                    type="radio"
                    {...register('paymentMethod')}
                    value={config.method}
                    className="sr-only"
                  />
                  <div className={`p-3 border rounded-lg transition-all hover:border-primary ${
                    selectedMethod === config.method 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{config.icon}</span>
                        <span className="text-sm font-medium">{config.displayName}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {paymentService.formatFee(config.processingFee)}
                      </span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.paymentMethod && (
              <p className="text-xs text-destructive">{errors.paymentMethod.message}</p>
            )}
          </div>

          {/* Method-specific fields */}
          {selectedMethod && (
            <>
              <Separator />
              {renderMethodSpecificFields()}
            </>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <X className="h-4 w-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="w-3 h-3" />
            <span>Beveiligd door SSL-encryptie</span>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isProcessing || !selectedMethod}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verwerken...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Betaal {selectedMethod && paymentService.formatAmount(totalAmount)}
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}