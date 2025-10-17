import { useState, useEffect, useCallback } from 'react'
import { useKV } from "@/hooks/use-local-storage"
import { toast } from 'sonner'
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
  PaymentMethodConfig
} from '@/types/payment'
import { paymentService } from '@/services/payment'

// Main payment hook for businesses
export function usePayments(businessId: string) {
  const [paymentMethods, setPaymentMethods] = useKV<PaymentMethodDetails[]>(`payment-methods-${businessId}`, [])
  const [transactions, setTransactions] = useKV<Transaction[]>(`transactions-${businessId}`, [])
  const [settings, setSettings] = useKV<PaymentSettings | null>(`payment-settings-${businessId}`, null)
  const [analytics, setAnalytics] = useKV<PaymentAnalytics | null>(`payment-analytics-${businessId}`, null)
  const [isLoading, setIsLoading] = useState(false)

  // Load payment methods
  const loadPaymentMethods = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await paymentService.getPaymentMethods(businessId)
      if (response.success && response.data) {
        setPaymentMethods(response.data)
      }
    } catch (error) {
      console.error('Error loading payment methods:', error)
    } finally {
      setIsLoading(false)
    }
  }, [businessId, setPaymentMethods])

  // Load transactions
  const loadTransactions = useCallback(async (params?: any) => {
    try {
      setIsLoading(true)
      const response = await paymentService.getTransactions(businessId, params)
      if (response.success && response.data) {
        setTransactions(response.data)
      }
    } catch (error) {
      console.error('Error loading transactions:', error)
    } finally {
      setIsLoading(false)
    }
  }, [businessId, setTransactions])

  // Load payment settings
  const loadSettings = useCallback(async () => {
    try {
      const response = await paymentService.getPaymentSettings(businessId)
      if (response.success && response.data) {
        setSettings(response.data)
      }
    } catch (error) {
      console.error('Error loading payment settings:', error)
    }
  }, [businessId, setSettings])

  // Load analytics
  const loadAnalytics = useCallback(async (params?: any) => {
    try {
      const response = await paymentService.getPaymentAnalytics(businessId, params)
      if (response.success && response.data) {
        setAnalytics(response.data)
      }
    } catch (error) {
      console.error('Error loading payment analytics:', error)
    }
  }, [businessId, setAnalytics])

  // Add payment method
  const addPaymentMethod = useCallback(async (methodData: Partial<PaymentMethodDetails>) => {
    try {
      setIsLoading(true)
      const response = await paymentService.addPaymentMethod(businessId, methodData)
      if (response.success && response.data) {
        setPaymentMethods(prev => [...(prev || []), response.data!])
        toast.success('Betaalmethode toegevoegd')
        return response.data
      } else {
        toast.error(response.error?.message || 'Fout bij toevoegen betaalmethode')
      }
    } catch (error) {
      toast.error('Er is een fout opgetreden')
    } finally {
      setIsLoading(false)
    }
    return null
  }, [businessId, setPaymentMethods])

  // Update payment method
  const updatePaymentMethod = useCallback(async (methodId: string, updates: Partial<PaymentMethodDetails>) => {
    try {
      const response = await paymentService.updatePaymentMethod(methodId, updates)
      if (response.success && response.data) {
        setPaymentMethods(prev => 
          (prev || []).map(method => 
            method.id === methodId ? response.data! : method
          )
        )
        toast.success('Betaalmethode bijgewerkt')
        return response.data
      } else {
        toast.error(response.error?.message || 'Fout bij bijwerken betaalmethode')
      }
    } catch (error) {
      toast.error('Er is een fout opgetreden')
    }
    return null
  }, [setPaymentMethods])

  // Remove payment method
  const removePaymentMethod = useCallback(async (methodId: string) => {
    try {
      const response = await paymentService.removePaymentMethod(methodId)
      if (response.success) {
        setPaymentMethods(prev => 
          (prev || []).filter(method => method.id !== methodId)
        )
        toast.success('Betaalmethode verwijderd')
        return true
      } else {
        toast.error(response.error?.message || 'Fout bij verwijderen betaalmethode')
      }
    } catch (error) {
      toast.error('Er is een fout opgetreden')
    }
    return false
  }, [setPaymentMethods])

  // Update payment settings
  const updateSettings = useCallback(async (updates: Partial<PaymentSettings>) => {
    try {
      const response = await paymentService.updatePaymentSettings(businessId, updates)
      if (response.success && response.data) {
        setSettings(response.data)
        toast.success('Instellingen bijgewerkt')
        return response.data
      } else {
        toast.error(response.error?.message || 'Fout bij bijwerken instellingen')
      }
    } catch (error) {
      toast.error('Er is een fout opgetreden')
    }
    return null
  }, [businessId, setSettings])

  // Create refund
  const createRefund = useCallback(async (transactionId: string, amount?: number, reason?: string) => {
    try {
      const response = await paymentService.createRefund(transactionId, {
        amount,
        reason: reason || 'Klantverzoek'
      })
      if (response.success) {
        // Reload transactions to get updated data
        loadTransactions()
        toast.success('Terugbetaling verwerkt')
        return response.data
      } else {
        toast.error(response.error?.message || 'Fout bij verwerken terugbetaling')
      }
    } catch (error) {
      toast.error('Er is een fout opgetreden')
    }
    return null
  }, [loadTransactions])

  useEffect(() => {
    if (businessId) {
      loadPaymentMethods()
      loadTransactions()
      loadSettings()
      loadAnalytics()
    }
  }, [businessId, loadPaymentMethods, loadTransactions, loadSettings, loadAnalytics])

  return {
    paymentMethods: paymentMethods || [],
    transactions: transactions || [],
    settings,
    analytics,
    isLoading,
    
    // Actions
    loadPaymentMethods,
    loadTransactions,
    loadSettings,
    loadAnalytics,
    addPaymentMethod,
    updatePaymentMethod,
    removePaymentMethod,
    updateSettings,
    createRefund
  }
}

// Hook for payment processing
export function usePaymentProcessing() {
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createPaymentIntent = useCallback(async (data: Partial<PaymentIntent>) => {
    try {
      setIsProcessing(true)
      setError(null)
      
      const response = await paymentService.createPaymentIntent(data)
      if (response.success && response.data) {
        setPaymentIntent(response.data)
        return response.data
      } else {
        setError(response.error?.message || 'Fout bij aanmaken betaling')
        toast.error(response.error?.message || 'Fout bij aanmaken betaling')
      }
    } catch (error) {
      const errorMessage = 'Er is een fout opgetreden bij het verwerken van de betaling'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsProcessing(false)
    }
    return null
  }, [])

  const confirmPaymentIntent = useCallback(async (intentId: string, paymentMethodData?: any) => {
    try {
      setIsProcessing(true)
      setError(null)
      
      const response = await paymentService.confirmPaymentIntent(intentId, paymentMethodData)
      if (response.success && response.data) {
        setPaymentIntent(response.data)
        
        if (response.data.status === 'succeeded') {
          toast.success('Betaling succesvol verwerkt!')
        }
        
        return response.data
      } else {
        const errorMessage = response.error?.message || 'Fout bij bevestigen betaling'
        setError(errorMessage)
        toast.error(errorMessage)
      }
    } catch (error) {
      const errorMessage = 'Er is een fout opgetreden bij het bevestigen van de betaling'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsProcessing(false)
    }
    return null
  }, [])

  const reset = useCallback(() => {
    setPaymentIntent(null)
    setError(null)
    setIsProcessing(false)
  }, [])

  return {
    paymentIntent,
    isProcessing,
    error,
    createPaymentIntent,
    confirmPaymentIntent,
    reset
  }
}

// Hook for subscription management
export function useSubscriptions(businessId?: string) {
  const [subscriptionPlans, setSubscriptionPlans] = useKV<SubscriptionPlan[]>('subscription-plans', [])
  const [currentSubscription, setCurrentSubscription] = useKV<Subscription | null>(
    businessId ? `subscription-${businessId}` : 'subscription-null', 
    null
  )
  const [invoices, setInvoices] = useKV<Invoice[]>(
    businessId ? `invoices-${businessId}` : 'invoices-null', 
    []
  )
  const [isLoading, setIsLoading] = useState(false)

  // Load subscription plans
  const loadPlans = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await paymentService.getSubscriptionPlans()
      if (response.success && response.data) {
        setSubscriptionPlans(response.data)
      }
    } catch (error) {
      console.error('Error loading subscription plans:', error)
    } finally {
      setIsLoading(false)
    }
  }, [setSubscriptionPlans])

  // Load current subscription
  const loadCurrentSubscription = useCallback(async (subscriptionId: string) => {
    try {
      const response = await paymentService.getSubscription(subscriptionId)
      if (response.success && response.data) {
        setCurrentSubscription(response.data)
      }
    } catch (error) {
      console.error('Error loading subscription:', error)
    }
  }, [setCurrentSubscription])

  // Load invoices
  const loadInvoices = useCallback(async () => {
    if (!businessId) return
    
    try {
      const response = await paymentService.getInvoices(businessId)
      if (response.success && response.data) {
        setInvoices(response.data)
      }
    } catch (error) {
      console.error('Error loading invoices:', error)
    }
  }, [businessId, setInvoices])

  // Create subscription
  const createSubscription = useCallback(async (data: {
    planId: string
    paymentMethodId: string
    metadata?: Record<string, any>
  }) => {
    if (!businessId) return null

    try {
      setIsLoading(true)
      const response = await paymentService.createSubscription({
        businessId,
        ...data
      })
      
      if (response.success && response.data) {
        setCurrentSubscription(response.data)
        toast.success('Abonnement succesvol aangemaakt!')
        return response.data
      } else {
        toast.error(response.error?.message || 'Fout bij aanmaken abonnement')
      }
    } catch (error) {
      toast.error('Er is een fout opgetreden')
    } finally {
      setIsLoading(false)
    }
    return null
  }, [businessId, setCurrentSubscription])

  // Update subscription
  const updateSubscription = useCallback(async (subscriptionId: string, updates: Partial<Subscription>) => {
    try {
      const response = await paymentService.updateSubscription(subscriptionId, updates)
      if (response.success && response.data) {
        setCurrentSubscription(response.data)
        toast.success('Abonnement bijgewerkt')
        return response.data
      } else {
        toast.error(response.error?.message || 'Fout bij bijwerken abonnement')
      }
    } catch (error) {
      toast.error('Er is een fout opgetreden')
    }
    return null
  }, [setCurrentSubscription])

  // Cancel subscription
  const cancelSubscription = useCallback(async (subscriptionId: string, cancelAtPeriodEnd = true) => {
    try {
      const response = await paymentService.cancelSubscription(subscriptionId, cancelAtPeriodEnd)
      if (response.success && response.data) {
        setCurrentSubscription(response.data)
        toast.success(cancelAtPeriodEnd ? 'Abonnement wordt opgezegd aan het einde van de periode' : 'Abonnement direct opgezegd')
        return response.data
      } else {
        toast.error(response.error?.message || 'Fout bij opzeggen abonnement')
      }
    } catch (error) {
      toast.error('Er is een fout opgetreden')
    }
    return null
  }, [setCurrentSubscription])

  // Download invoice PDF
  const downloadInvoice = useCallback(async (invoiceId: string) => {
    try {
      const pdfBlob = await paymentService.downloadInvoicePdf(invoiceId)
      if (pdfBlob) {
        const url = URL.createObjectURL(pdfBlob)
        const a = document.createElement('a')
        a.href = url
        a.download = `factuur-${invoiceId}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success('Factuur gedownload')
      } else {
        toast.error('Kan factuur niet downloaden')
      }
    } catch (error) {
      toast.error('Fout bij downloaden factuur')
    }
  }, [])

  useEffect(() => {
    loadPlans()
    if (businessId) {
      loadInvoices()
    }
  }, [businessId, loadPlans, loadInvoices])

  return {
    subscriptionPlans: subscriptionPlans || [],
    currentSubscription,
    invoices: invoices || [],
    isLoading,
    
    // Actions
    loadPlans,
    loadCurrentSubscription,
    loadInvoices,
    createSubscription,
    updateSubscription,
    cancelSubscription,
    downloadInvoice
  }
}

// Hook for payment method configurations
export function usePaymentMethodConfigs() {
  const [configs] = useState<PaymentMethodConfig[]>(() => 
    paymentService.getPaymentMethodConfigs()
  )

  const getConfigByMethod = useCallback((method: DutchPaymentMethod) => {
    return configs.find(config => config.method === method)
  }, [configs])

  const getEnabledConfigs = useCallback(() => {
    return configs.filter(config => config.isEnabled)
  }, [configs])

  const getConfigsForCurrency = useCallback((currency: string) => {
    return configs.filter(config => 
      config.isEnabled && config.currencies.includes(currency)
    )
  }, [configs])

  return {
    configs,
    getConfigByMethod,
    getEnabledConfigs,
    getConfigsForCurrency
  }
}

// Hook for payouts
export function usePayouts(businessId: string) {
  const [payouts, setPayouts] = useKV<PayoutInfo[]>(`payouts-${businessId}`, [])
  const [isLoading, setIsLoading] = useState(false)

  const loadPayouts = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await paymentService.getPayouts(businessId)
      if (response.success && response.data) {
        setPayouts(response.data)
      }
    } catch (error) {
      console.error('Error loading payouts:', error)
    } finally {
      setIsLoading(false)
    }
  }, [businessId, setPayouts])

  const createManualPayout = useCallback(async (data: {
    amount: number
    currency: string
    description?: string
  }) => {
    try {
      setIsLoading(true)
      const response = await paymentService.createManualPayout(businessId, data)
      if (response.success && response.data) {
        setPayouts(prev => [response.data!, ...(prev || [])])
        toast.success('Uitbetaling aangevraagd')
        return response.data
      } else {
        toast.error(response.error?.message || 'Fout bij aanvragen uitbetaling')
      }
    } catch (error) {
      toast.error('Er is een fout opgetreden')
    } finally {
      setIsLoading(false)
    }
    return null
  }, [businessId, setPayouts])

  useEffect(() => {
    if (businessId) {
      loadPayouts()
    }
  }, [businessId, loadPayouts])

  return {
    payouts: payouts || [],
    isLoading,
    loadPayouts,
    createManualPayout
  }
}