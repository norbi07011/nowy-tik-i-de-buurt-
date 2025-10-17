import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  CreditCard, 
  Bank, 
  ShieldCheck, 
  Lock,
  Check,
  X,
  Info
} from '@phosphor-icons/react'
import { usePaymentProcessing, usePaymentMethodConfigs } from '@/hooks/use-payment'
import { DutchPaymentMethod } from '@/types/payment'
import { paymentService } from '@/services/payment'

const paymentFormSchema = z.object({
  amount: z.number().min(0.5, 'Minimum bedrag is €0,50'),
  description: z.string().min(1, 'Beschrijving is verplicht'),
  paymentMethod: z.string().min(1, 'Selecteer een betaalmethode'),
  customerName: z.string().min(2, 'Naam is verplicht'),
  customerEmail: z.string().email('Ongeldig e-mailadres'),
  customerPhone: z.string().optional(),
  
  // Method-specific fields
  idealBank: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  cardHolderName: z.string().optional(),
  iban: z.string().optional(),
  mandateAccepted: z.boolean().optional(),
  
  returnUrl: z.string().url().optional()
})

type PaymentFormData = z.infer<typeof paymentFormSchema>

interface PaymentFormProps {
  businessId: string
  onSuccess?: (paymentIntent: any) => void
  onError?: (error: string) => void
  defaultAmount?: number
  defaultDescription?: string
}

export function PaymentForm({ 
  businessId, 
  onSuccess, 
  onError,
  defaultAmount,
  defaultDescription 
}: PaymentFormProps) {
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
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      amount: defaultAmount || 0,
      description: defaultDescription || '',
      returnUrl: `${window.location.origin}/payment/success`
    }
  })

  const watchedAmount = watch('amount')
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

  const onSubmit = async (data: PaymentFormData) => {
    if (!selectedMethod) return

    try {
      // Create payment intent
      const paymentIntent = await createPaymentIntent({
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: 'EUR',
        paymentMethod: selectedMethod,
        description: data.description,
        businessId,
        customerDetails: {
          name: data.customerName,
          email: data.customerEmail,
          phone: data.customerPhone
        },
        returnUrl: data.returnUrl
      })

      if (!paymentIntent) return

      // Prepare payment method data based on selected method
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
      } else if (selectedMethod === 'sepa') {
        paymentMethodData.sepa = {
          iban: data.iban,
          mandateAccepted: data.mandateAccepted
        }
      }

      // Confirm payment intent
      const confirmedIntent = await confirmPaymentIntent(paymentIntent.id, paymentMethodData)
      
      if (confirmedIntent && onSuccess) {
        onSuccess(confirmedIntent)
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
          <div className="space-y-4">
            <div>
              <Label htmlFor="idealBank">Selecteer je bank</Label>
              <Select onValueChange={(value) => setValue('idealBank', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Kies je bank" />
                </SelectTrigger>
                <SelectContent>
                  {idealBanks.map((bank) => (
                    <SelectItem key={bank.id} value={bank.id}>
                      <div className="flex items-center gap-2">
                        <span>{bank.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 'creditcard':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="cardHolderName">Naam op kaart</Label>
                <Input
                  {...register('cardHolderName')}
                  placeholder="J. de Vries"
                />
                {errors.cardHolderName && (
                  <p className="text-sm text-destructive mt-1">{errors.cardHolderName.message}</p>
                )}
              </div>
              <div className="col-span-2">
                <Label htmlFor="cardNumber">Kaartnummer</Label>
                <Input
                  {...register('cardNumber')}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
                {errors.cardNumber && (
                  <p className="text-sm text-destructive mt-1">{errors.cardNumber.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="cardExpiry">Vervaldatum</Label>
                <Input
                  {...register('cardExpiry')}
                  placeholder="MM/YY"
                  maxLength={5}
                />
                {errors.cardExpiry && (
                  <p className="text-sm text-destructive mt-1">{errors.cardExpiry.message}</p>
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
                  <p className="text-sm text-destructive mt-1">{errors.cardCvc.message}</p>
                )}
              </div>
            </div>
          </div>
        )

      case 'sepa':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="iban">IBAN</Label>
              <Input
                {...register('iban')}
                placeholder="NL91 ABNA 0417 164300"
              />
              {errors.iban && (
                <p className="text-sm text-destructive mt-1">{errors.iban.message}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="mandateAccepted"
                onCheckedChange={(checked) => setValue('mandateAccepted', !!checked)}
              />
              <Label htmlFor="mandateAccepted" className="text-sm">
                Ik geef toestemming voor SEPA incasso machtiging
              </Label>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Nieuwe Betaling
        </CardTitle>
        <CardDescription>
          Verwerk een betaling met een van de beschikbare betaalmethoden
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Payment Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Bedrag (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.5"
                  {...register('amount', { valueAsNumber: true })}
                  placeholder="0.00"
                />
                {errors.amount && (
                  <p className="text-sm text-destructive mt-1">{errors.amount.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="description">Beschrijving</Label>
                <Input
                  {...register('description')}
                  placeholder="Betaling voor..."
                />
                {errors.description && (
                  <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="space-y-4">
            <h3 className="font-medium">Klantgegevens</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Naam</Label>
                <Input
                  {...register('customerName')}
                  placeholder="Jan de Vries"
                />
                {errors.customerName && (
                  <p className="text-sm text-destructive mt-1">{errors.customerName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="customerEmail">E-mail</Label>
                <Input
                  type="email"
                  {...register('customerEmail')}
                  placeholder="jan@example.com"
                />
                {errors.customerEmail && (
                  <p className="text-sm text-destructive mt-1">{errors.customerEmail.message}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="customerPhone">Telefoonnummer (optioneel)</Label>
              <Input
                {...register('customerPhone')}
                placeholder="+31 6 12345678"
              />
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <h3 className="font-medium">Betaalmethode</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {enabledMethods.map((config) => (
                <label key={config.method} className="cursor-pointer">
                  <input
                    type="radio"
                    {...register('paymentMethod')}
                    value={config.method}
                    className="sr-only"
                  />
                  <div className={`p-4 border rounded-lg transition-all hover:border-primary ${
                    selectedMethod === config.method 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{config.icon}</span>
                        <div>
                          <p className="font-medium">{config.displayName}</p>
                          <p className="text-xs text-muted-foreground">
                            {config.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {paymentService.formatFee(config.processingFee)}
                        </p>
                        {watchedAmount > 0 && (
                          <p className="text-xs font-medium">
                            +{paymentService.formatAmount(calculateFee(watchedAmount, config.method))}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.paymentMethod && (
              <p className="text-sm text-destructive">{errors.paymentMethod.message}</p>
            )}
          </div>

          {/* Method-specific fields */}
          {selectedMethod && (
            <div className="space-y-4">
              <Separator />
              <h3 className="font-medium">
                {selectedConfig?.displayName} Details
              </h3>
              {renderMethodSpecificFields()}
            </div>
          )}

          {/* Payment Summary */}
          {watchedAmount > 0 && selectedMethod && (
            <div className="space-y-4">
              <Separator />
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Subtotaal</span>
                  <span>{paymentService.formatAmount(watchedAmount)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Transactiekosten ({paymentService.formatFee(selectedConfig?.processingFee || 0)})</span>
                  <span>+{paymentService.formatAmount(calculateFee(watchedAmount, selectedMethod))}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Totaal</span>
                  <span>{paymentService.formatAmount(watchedAmount + calculateFee(watchedAmount, selectedMethod))}</span>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <X className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="w-4 h-4" />
            <span>Beveiligd door SSL-encryptie</span>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isProcessing || !selectedMethod}
            size="lg"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verwerken...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Betaling Verwerken
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}