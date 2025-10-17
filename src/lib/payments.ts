export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: 'requires_payment_method' | 'requires_confirmation' | 'processing' | 'succeeded' | 'canceled'
  clientSecret: string
  paymentMethodId?: string
  metadata: Record<string, string>
}

export interface PaymentResult {
  success: boolean
  paymentIntent?: PaymentIntent
  error?: {
    code: string
    message: string
    type: 'card_error' | 'validation_error' | 'api_error'
  }
}

export interface InvoiceItem {
  id: string
  description: string
  amount: number
  quantity: number
  unitPrice: number
}

export interface Invoice {
  id: string
  businessId: string
  number: string
  date: string
  dueDate: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'canceled'
  subtotal: number
  tax: number
  total: number
  currency: string
  items: InvoiceItem[]
  customer: {
    name: string
    email: string
    address?: string
  }
  paymentMethod?: string
  paidAt?: string
  createdAt: string
}

// Simulated Payment Gateway
export class PaymentGateway {
  private static instance: PaymentGateway

  public static getInstance(): PaymentGateway {
    if (!PaymentGateway.instance) {
      PaymentGateway.instance = new PaymentGateway()
    }
    return PaymentGateway.instance
  }

  async createPaymentIntent(amount: number, currency: string = 'EUR', metadata: Record<string, string> = {}): Promise<PaymentIntent> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return {
      id: `pi_${Date.now()}`,
      amount,
      currency,
      status: 'requires_payment_method',
      clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      metadata
    }
  }

  async confirmPayment(paymentIntentId: string, paymentMethodId: string): Promise<PaymentResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Simulate random success/failure for testing
    const isSuccess = Math.random() > 0.1 // 90% success rate

    if (isSuccess) {
      return {
        success: true,
        paymentIntent: {
          id: paymentIntentId,
          amount: 1400, // €14.00 in cents
          currency: 'EUR',
          status: 'succeeded',
          clientSecret: `${paymentIntentId}_secret`,
          paymentMethodId,
          metadata: {}
        }
      }
    } else {
      return {
        success: false,
        error: {
          code: 'card_declined',
          message: 'Your card was declined.',
          type: 'card_error'
        }
      }
    }
  }

  async createSubscription(businessId: string, priceId: string, paymentMethodId: string): Promise<PaymentResult> {
    // Simulate subscription creation
    await new Promise(resolve => setTimeout(resolve, 800))

    return {
      success: true,
      paymentIntent: {
        id: `sub_${Date.now()}`,
        amount: 1400,
        currency: 'EUR',
        status: 'succeeded',
        clientSecret: `sub_${Date.now()}_secret`,
        paymentMethodId,
        metadata: { businessId, priceId }
      }
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<{ success: boolean; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return { success: true }
  }

  async generateInvoice(businessId: string, items: InvoiceItem[], customer: Invoice['customer']): Promise<Invoice> {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    const tax = subtotal * 0.21 // 21% VAT for Netherlands
    const total = subtotal + tax

    return {
      id: `inv_${Date.now()}`,
      businessId,
      number: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      subtotal,
      tax,
      total,
      currency: 'EUR',
      items,
      customer,
      createdAt: new Date().toISOString()
    }
  }

  async processRefund(paymentIntentId: string, amount?: number): Promise<PaymentResult> {
    await new Promise(resolve => setTimeout(resolve, 600))

    return {
      success: true,
      paymentIntent: {
        id: `re_${Date.now()}`,
        amount: amount || 1400,
        currency: 'EUR',
        status: 'succeeded',
        clientSecret: `refund_${Date.now()}_secret`,
        metadata: { originalPayment: paymentIntentId }
      }
    }
  }

  // Webhook simulation for real-time payment updates
  simulateWebhook(eventType: string, data: any): void {
    // In a real app, this would be called by the payment processor
    const event = {
      type: eventType,
      data,
      timestamp: new Date().toISOString()
    }

    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('paymentWebhook', { detail: event }))
  }
}

// Payment utility functions
export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: currency
  }).format(amount / 100) // Convert from cents
}

export const validateCardNumber = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, '')
  
  // Basic Luhn algorithm check
  let sum = 0
  let isEven = false
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i])
    
    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return sum % 10 === 0 && cleaned.length >= 13 && cleaned.length <= 19
}

export const validateExpiryDate = (expiry: string): boolean => {
  const [month, year] = expiry.split('/').map(s => parseInt(s))
  
  if (!month || !year || month < 1 || month > 12) {
    return false
  }
  
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear() % 100
  const currentMonth = currentDate.getMonth() + 1
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false
  }
  
  return true
}

export const getCardBrand = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, '')
  
  if (/^4/.test(cleaned)) return 'Visa'
  if (/^5[1-5]/.test(cleaned)) return 'Mastercard'
  if (/^3[47]/.test(cleaned)) return 'American Express'
  if (/^6/.test(cleaned)) return 'Discover'
  
  return 'Unknown'
}

export const paymentGateway = PaymentGateway.getInstance()