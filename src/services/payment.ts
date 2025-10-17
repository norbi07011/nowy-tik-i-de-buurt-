import { 
  PaymentIntent, 
  PaymentMethodDetails, 
  Transaction, 
  PaymentSettings, 
  Subscription, 
  SubscriptionPlan, 
  Invoice, 
  PaymentAnalytics,
  PayoutInfo,
  DutchPaymentMethod,
  PaymentForm,
  PaymentMethodConfig,
  Refund,
  PaymentError
} from '@/types/payment'
import { ApiResponse } from '@/types'

class PaymentService {
  private baseUrl = '/api/payments'

  // Payment Intents
  async createPaymentIntent(data: Partial<PaymentIntent>): Promise<ApiResponse<PaymentIntent>> {
    try {
      const response = await fetch(`${this.baseUrl}/intents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'network_error',
          message: 'Er is een netwerkfout opgetreden'
        }
      }
    }
  }

  async confirmPaymentIntent(
    intentId: string, 
    paymentMethodData?: any
  ): Promise<ApiResponse<PaymentIntent>> {
    try {
      const response = await fetch(`${this.baseUrl}/intents/${intentId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethodData })
      })
      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'network_error',
          message: 'Bevestiging van betaling mislukt'
        }
      }
    }
  }

  async getPaymentIntent(intentId: string): Promise<ApiResponse<PaymentIntent>> {
    try {
      const response = await fetch(`${this.baseUrl}/intents/${intentId}`)
      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'network_error',
          message: 'Kan betalingsintentie niet ophalen'
        }
      }
    }
  }

  // Payment Methods
  async getPaymentMethods(businessId: string): Promise<ApiResponse<PaymentMethodDetails[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/businesses/${businessId}/methods`)
      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'network_error',
          message: 'Kan betaalmethoden niet ophalen'
        }
      }
    }
  }

  async addPaymentMethod(
    businessId: string, 
    methodData: Partial<PaymentMethodDetails>
  ): Promise<ApiResponse<PaymentMethodDetails>> {
    try {
      const response = await fetch(`${this.baseUrl}/businesses/${businessId}/methods`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(methodData)
      })
      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'network_error',
          message: 'Kan betaalmethode niet toevoegen'
        }
      }
    }
  }

  async updatePaymentMethod(
    methodId: string, 
    updates: Partial<PaymentMethodDetails>
  ): Promise<ApiResponse<PaymentMethodDetails>> {
    try {
      const response = await fetch(`${this.baseUrl}/methods/${methodId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'network_error',
          message: 'Kan betaalmethode niet bijwerken'
        }
      }
    }
  }

  async removePaymentMethod(methodId: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/methods/${methodId}`, {
        method: 'DELETE'
      })
      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'network_error',
          message: 'Kan betaalmethode niet verwijderen'
        }
      }
    }
  }

  // Transactions
  async getTransactions(
    businessId: string, 
    params?: {
      limit?: number
      offset?: number
      status?: string
      paymentMethod?: DutchPaymentMethod
      dateFrom?: string
      dateTo?: string
    }
  ): Promise<ApiResponse<Transaction[]>> {
    try {
      const query = new URLSearchParams(params as Record<string, string>)
      const response = await fetch(`${this.baseUrl}/businesses/${businessId}/transactions?${query}`)
      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'network_error',
          message: 'Kan transacties niet ophalen'
        }
      }
    }
  }

  async getTransaction(transactionId: string): Promise<ApiResponse<Transaction>> {
    try {
      const response = await fetch(`${this.baseUrl}/transactions/${transactionId}`)
      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'network_error',
          message: 'Kan transactie niet ophalen'
        }
      }
    }
  }

  // Refunds
  async createRefund(
    transactionId: string, 
    data: {
      amount?: number
      reason: string
      metadata?: Record<string, any>
    }
  ): Promise<ApiResponse<Refund>> {
    try {
      const response = await fetch(`${this.baseUrl}/transactions/${transactionId}/refunds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'network_error',
          message: 'Kan terugbetaling niet verwerken'
        }
      }
    }
  }

  // Payment Settings
  async getPaymentSettings(businessId: string): Promise<ApiResponse<PaymentSettings>> {
    try {
      const response = await fetch(`${this.baseUrl}/businesses/${businessId}/settings`)
      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'network_error',
          message: 'Kan betalingsinstellingen niet ophalen'
        }
      }
    }
  }

  async updatePaymentSettings(
    businessId: string, 
    settings: Partial<PaymentSettings>
  ): Promise<ApiResponse<PaymentSettings>> {
    try {
      const response = await fetch(`${this.baseUrl}/businesses/${businessId}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'network_error',
          message: 'Kan instellingen niet bijwerken'
        }
      }
    }
  }

  // Subscriptions
  async getSubscriptionPlans(): Promise<ApiResponse<SubscriptionPlan[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/subscription-plans`)
      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'network_error',
          message: 'Kan abonnementen niet ophalen'
        }
      }
    }
  }

  async createSubscription(data: {
    businessId: string
    planId: string
    paymentMethodId: string
    metadata?: Record<string, any>
  }): Promise<ApiResponse<Subscription>> {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'network_error',
          message: 'Kan abonnement niet aanmaken'
        }
      }
    }
  }

  async getSubscription(subscriptionId: string): Promise<ApiResponse<Subscription>> {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}`)
      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'network_error',
          message: 'Kan abonnement niet ophalen'
        }
      }
    }
  }

  async updateSubscription(
    subscriptionId: string, 
    updates: Partial<Subscription>
  ): Promise<ApiResponse<Subscription>> {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'network_error',
          message: 'Kan abonnement niet bijwerken'
        }
      }
    }
  }

  async cancelSubscription(
    subscriptionId: string, 
    cancelAtPeriodEnd: boolean = true
  ): Promise<ApiResponse<Subscription>> {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cancelAtPeriodEnd })
      })
      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'network_error',
          message: 'Kan abonnement niet opzeggen'
        }
      }
    }
  }

  // Invoices
  async getInvoices(
    businessId: string, 
    params?: {
      limit?: number
      offset?: number
      status?: string
      dateFrom?: string
      dateTo?: string
    }
  ): Promise<ApiResponse<Invoice[]>> {
    try {
      const query = new URLSearchParams(params as Record<string, string>)
      const response = await fetch(`${this.baseUrl}/businesses/${businessId}/invoices?${query}`)
      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'network_error',
          message: 'Kan facturen niet ophalen'
        }
      }
    }
  }

  async getInvoice(invoiceId: string): Promise<ApiResponse<Invoice>> {
    try {
      const response = await fetch(`${this.baseUrl}/invoices/${invoiceId}`)
      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'network_error',
          message: 'Kan factuur niet ophalen'
        }
      }
    }
  }

  async downloadInvoicePdf(invoiceId: string): Promise<Blob | null> {
    try {
      const response = await fetch(`${this.baseUrl}/invoices/${invoiceId}/pdf`)
      if (response.ok) {
        return await response.blob()
      }
      return null
    } catch (error) {
      console.error('Error downloading invoice PDF:', error)
      return null
    }
  }

  // Analytics
  async getPaymentAnalytics(
    businessId: string, 
    params?: {
      period?: string
      dateFrom?: string
      dateTo?: string
    }
  ): Promise<ApiResponse<PaymentAnalytics>> {
    try {
      const query = new URLSearchParams(params as Record<string, string>)
      const response = await fetch(`${this.baseUrl}/businesses/${businessId}/analytics?${query}`)
      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'network_error',
          message: 'Kan betalingsanalyses niet ophalen'
        }
      }
    }
  }

  // Payouts
  async getPayouts(businessId: string): Promise<ApiResponse<PayoutInfo[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/businesses/${businessId}/payouts`)
      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'network_error',
          message: 'Kan uitbetalingen niet ophalen'
        }
      }
    }
  }

  async createManualPayout(
    businessId: string, 
    data: {
      amount: number
      currency: string
      description?: string
    }
  ): Promise<ApiResponse<PayoutInfo>> {
    try {
      const response = await fetch(`${this.baseUrl}/businesses/${businessId}/payouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'network_error',
          message: 'Kan uitbetaling niet verwerken'
        }
      }
    }
  }

  // Utility Methods
  async validateIban(iban: string): Promise<ApiResponse<{ isValid: boolean, bankName?: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/utils/validate-iban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ iban })
      })
      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'network_error',
          message: 'Kan IBAN niet valideren'
        }
      }
    }
  }

  async getIdealBanks(): Promise<ApiResponse<{ id: string, name: string, logo: string }[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/utils/ideal-banks`)
      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'network_error',
          message: 'Kan iDEAL banken niet ophalen'
        }
      }
    }
  }

  // Payment Method Configurations
  getPaymentMethodConfigs(): PaymentMethodConfig[] {
    return [
      {
        method: 'ideal',
        displayName: 'iDEAL',
        description: 'Betaal direct vanuit je bankrekening',
        icon: '🏦',
        isEnabled: true,
        processingFee: 0.29,
        currencies: ['EUR'],
        requiresRedirect: true,
        supportsSaveForLater: false,
        supportsRefunds: true,
        maxAmount: 50000
      },
      {
        method: 'creditcard',
        displayName: 'Credit Card',
        description: 'Betaal met Visa, Mastercard of American Express',
        icon: '💳',
        isEnabled: true,
        processingFee: 1.4,
        currencies: ['EUR'],
        requiresRedirect: false,
        supportsSaveForLater: true,
        supportsRefunds: true,
        minAmount: 0.50
      },
      {
        method: 'sepa',
        displayName: 'SEPA Incasso',
        description: 'Automatische incasso via SEPA',
        icon: '🏛️',
        isEnabled: true,
        processingFee: 0.25,
        currencies: ['EUR'],
        requiresRedirect: false,
        supportsSaveForLater: true,
        supportsRefunds: true,
        requiresMandate: true,
        mandateType: 'recurring'
      },
      {
        method: 'bancontact',
        displayName: 'Bancontact',
        description: 'Betaal met je Bancontact kaart',
        icon: '🇧🇪',
        isEnabled: true,
        processingFee: 0.25,
        currencies: ['EUR'],
        requiresRedirect: true,
        supportsSaveForLater: false,
        supportsRefunds: true
      },
      {
        method: 'sofort',
        displayName: 'SOFORT',
        description: 'Directe bankoverschrijving',
        icon: '⚡',
        isEnabled: true,
        processingFee: 0.90,
        currencies: ['EUR'],
        requiresRedirect: true,
        supportsSaveForLater: false,
        supportsRefunds: true
      },
      {
        method: 'klarna',
        displayName: 'Klarna',
        description: 'Betaal nu, later of in termijnen',
        icon: '🛍️',
        isEnabled: true,
        processingFee: 1.5,
        currencies: ['EUR'],
        requiresRedirect: true,
        supportsSaveForLater: false,
        supportsRefunds: true,
        minAmount: 1.00,
        maxAmount: 10000
      },
      {
        method: 'paypal',
        displayName: 'PayPal',
        description: 'Betaal met je PayPal account',
        icon: '🅿️',
        isEnabled: true,
        processingFee: 2.49,
        currencies: ['EUR'],
        requiresRedirect: true,
        supportsSaveForLater: true,
        supportsRefunds: true
      }
    ]
  }

  // Error handling helpers
  parsePaymentError(error: any): PaymentError {
    return {
      code: error.code || 'unknown_error',
      message: error.message || 'Er is een onbekende fout opgetreden',
      type: error.type || 'api_error',
      param: error.param,
      dutchErrorCode: error.dutchErrorCode,
      bankResponseCode: error.bankResponseCode,
      declineCode: error.declineCode,
      chargeId: error.chargeId,
      paymentIntentId: error.paymentIntentId,
      paymentMethodId: error.paymentMethodId,
      docUrl: error.docUrl,
      requestId: error.requestId
    }
  }

  formatAmount(amount: number, currency: string = 'EUR'): string {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency
    }).format(amount / 100) // Assuming amounts are in cents
  }

  formatFee(fee: number): string {
    return `${fee}%`
  }
}

export const paymentService = new PaymentService()