export type DutchPaymentMethod = 
  | 'ideal'
  | 'bancontact'
  | 'sepa'
  | 'sofort'
  | 'klarna'
  | 'paypal'
  | 'creditcard'
  | 'belfius'
  | 'kbc'
  | 'ing'
  | 'rabobank'
  | 'abn_amro'

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'canceled'
  | 'refunded'
  | 'partially_refunded'

export type TransactionType = 
  | 'subscription'
  | 'promotion'
  | 'service_fee'
  | 'refund'
  | 'chargeback'
  | 'payout'

export interface PaymentMethodDetails {
  id: string
  type: DutchPaymentMethod
  name: string
  description: string
  icon: string
  isDefault: boolean
  isEnabled: boolean
  processingFee: number
  minAmount?: number
  maxAmount?: number
  currencies: string[]
  
  // For cards
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  
  // For bank accounts
  iban?: string
  accountHolder?: string
  bankName?: string
  
  // For digital wallets
  email?: string
  phone?: string
  
  createdAt: string
  updatedAt: string
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: PaymentStatus
  paymentMethod: DutchPaymentMethod
  description: string
  metadata: Record<string, string>
  customerId?: string
  businessId?: string
  subscriptionId?: string
  
  // Dutch specific fields
  customerDetails: {
    name: string
    email: string
    phone?: string
    address?: Address
  }
  
  // Payment method specific data
  paymentMethodData?: {
    ideal?: {
      bank: string
      bic?: string
    }
    sepa?: {
      iban: string
      mandateId?: string
    }
    card?: {
      holderName: string
      number: string
      expiryMonth: number
      expiryYear: number
      cvc: string
    }
  }
  
  webhookEndpoints?: string[]
  returnUrl?: string
  failureUrl?: string
  
  createdAt: string
  expiresAt?: string
}

export interface Address {
  line1: string
  line2?: string
  city: string
  postalCode: string
  state?: string
  country: string
}

export interface Transaction {
  id: string
  paymentIntentId: string
  businessId: string
  customerId?: string
  type: TransactionType
  amount: number
  fee: number
  netAmount: number
  currency: string
  status: PaymentStatus
  paymentMethod: DutchPaymentMethod
  description: string
  
  // Financial details
  grossAmount: number
  platformFee: number
  processingFee: number
  vatAmount?: number
  
  // Metadata
  metadata: Record<string, any>
  invoiceNumber?: string
  referenceId?: string
  
  // Timestamps
  createdAt: string
  processedAt?: string
  settledAt?: string
  
  // Refund information
  refunds?: Refund[]
  totalRefunded: number
  
  // Failure information
  failureCode?: string
  failureMessage?: string
  
  // Settlement information
  payoutId?: string
  settlementCurrency?: string
  settlementAmount?: number
  exchangeRate?: number
}

export interface Refund {
  id: string
  transactionId: string
  amount: number
  currency: string
  reason: string
  status: PaymentStatus
  metadata?: Record<string, any>
  createdAt: string
  processedAt?: string
}

export interface PaymentSettings {
  businessId: string
  
  // Enabled payment methods
  enabledMethods: DutchPaymentMethod[]
  
  // Bank account for payouts
  bankAccount: {
    iban: string
    accountHolder: string
    bankName: string
    isVerified: boolean
  }
  
  // Business details for payments
  businessDetails: {
    legalName: string
    kvkNumber: string
    vatNumber?: string
    address: Address
  }
  
  // Webhook settings
  webhooks: {
    endpoint: string
    events: string[]
    secret: string
    isActive: boolean
  }
  
  // Processing settings
  automaticPayouts: boolean
  payoutSchedule: 'daily' | 'weekly' | 'monthly'
  minimumPayoutAmount: number
  
  // Risk settings
  riskSettings: {
    maxTransactionAmount: number
    dailyTransactionLimit: number
    monthlyTransactionLimit: number
    requiresManualReview: boolean
  }
  
  createdAt: string
  updatedAt: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'month' | 'year'
  intervalCount: number
  trialDays?: number
  
  features: string[]
  limits: {
    posts: number
    promotions: number
    analytics: boolean
    prioritySupport: boolean
    customDomain: boolean
  }
  
  isPopular: boolean
  isActive: boolean
  
  createdAt: string
  updatedAt: string
}

export interface Subscription {
  id: string
  businessId: string
  planId: string
  customerId: string
  
  status: 'active' | 'past_due' | 'canceled' | 'unpaid' | 'trialing'
  currentPeriodStart: string
  currentPeriodEnd: string
  
  // Payment details
  paymentMethod: DutchPaymentMethod
  paymentMethodId: string
  
  // Billing
  amount: number
  currency: string
  taxAmount?: number
  discountAmount?: number
  
  // Trial information
  trialStart?: string
  trialEnd?: string
  
  // Cancellation
  cancelAtPeriodEnd: boolean
  canceledAt?: string
  cancellationReason?: string
  
  // Metadata
  metadata: Record<string, any>
  
  createdAt: string
  updatedAt: string
}

export interface Invoice {
  id: string
  subscriptionId?: string
  businessId: string
  customerId: string
  
  number: string
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible'
  
  // Amounts
  subtotal: number
  taxAmount: number
  discountAmount: number
  total: number
  amountPaid: number
  amountDue: number
  currency: string
  
  // Line items
  lineItems: InvoiceLineItem[]
  
  // Dates
  issueDate: string
  dueDate: string
  paidAt?: string
  
  // Payment
  paymentMethod?: DutchPaymentMethod
  paymentIntentId?: string
  
  // PDF and delivery
  pdfUrl?: string
  isEmailSent: boolean
  emailSentAt?: string
  
  // Legal requirements (Dutch)
  vatNumber?: string
  kvkNumber?: string
  
  createdAt: string
  updatedAt: string
}

export interface InvoiceLineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
  vatRate: number
  vatAmount: number
  
  metadata?: Record<string, any>
}

export interface PaymentError {
  code: string
  message: string
  type: 'card_error' | 'invalid_request_error' | 'api_error' | 'authentication_error'
  param?: string
  
  // Dutch specific errors
  dutchErrorCode?: string
  bankResponseCode?: string
  
  declineCode?: string
  chargeId?: string
  paymentIntentId?: string
  paymentMethodId?: string
  
  docUrl?: string
  requestId?: string
}

export interface PaymentAnalytics {
  businessId: string
  period: {
    start: string
    end: string
  }
  
  // Volume metrics
  totalVolume: number
  totalTransactions: number
  averageTransactionSize: number
  
  // Success metrics
  successRate: number
  failureRate: number
  
  // Payment method breakdown
  methodBreakdown: {
    method: DutchPaymentMethod
    volume: number
    transactions: number
    successRate: number
  }[]
  
  // Revenue metrics
  grossRevenue: number
  netRevenue: number
  totalFees: number
  
  // Refunds
  totalRefunds: number
  refundRate: number
  
  // Subscription metrics
  newSubscriptions: number
  canceledSubscriptions: number
  churnRate: number
  
  // Trends
  dailyVolume: {
    date: string
    volume: number
    transactions: number
  }[]
  
  // Geographic data
  locationBreakdown: {
    country: string
    volume: number
    transactions: number
  }[]
}

export interface PayoutInfo {
  id: string
  businessId: string
  
  amount: number
  currency: string
  fee: number
  netAmount: number
  
  status: 'pending' | 'in_transit' | 'paid' | 'failed' | 'canceled'
  
  // Bank details
  destination: {
    iban: string
    accountHolder: string
    bankName: string
  }
  
  // Included transactions
  transactionIds: string[]
  
  // Processing info
  expectedArrival: string
  actualArrival?: string
  
  failureCode?: string
  failureMessage?: string
  
  createdAt: string
  updatedAt: string
}

// Form types for payment UI
export interface PaymentForm {
  amount: number
  currency: string
  description: string
  paymentMethod: DutchPaymentMethod
  
  customerDetails: {
    name: string
    email: string
    phone?: string
  }
  
  // Method specific fields
  idealBank?: string
  
  cardDetails?: {
    holderName: string
    number: string
    expiryMonth: number
    expiryYear: number
    cvc: string
  }
  
  sepaDetails?: {
    iban: string
    accountHolder: string
    mandateAccepted: boolean
  }
  
  returnUrl?: string
}

export interface PaymentMethodConfig {
  method: DutchPaymentMethod
  displayName: string
  description: string
  icon: string
  isEnabled: boolean
  processingFee: number
  currencies: string[]
  
  // UI configuration
  requiresRedirect: boolean
  supportsSaveForLater: boolean
  supportsRefunds: boolean
  
  // Limits
  minAmount?: number
  maxAmount?: number
  
  // Additional data needed
  requiresMandate?: boolean
  mandateType?: 'one-off' | 'recurring'
}