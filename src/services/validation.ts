import { z } from 'zod'

// Dutch postal code validation
const dutchPostalCodeRegex = /^[1-9][0-9]{3} ?[A-Z]{2}$/i

// Dutch phone number validation 
const dutchPhoneRegex = /^(\+31|0031|0)[6-9][0-9]{8}$/

// Dutch KvK number validation (8 digits)
const kvkNumberRegex = /^[0-9]{8}$/

// Dutch BTW number validation
const btwNumberRegex = /^NL[0-9]{9}B[0-9]{2}$/

// User validation schemas
export const loginSchema = z.object({
  email: z.string().email('Voer een geldig e-mailadres in'),
  password: z.string().min(6, 'Wachtwoord moet minimaal 6 karakters lang zijn'),
  rememberMe: z.boolean().optional()
})

export const personalRegistrationSchema = z.object({
  name: z.string().min(2, 'Naam moet minimaal 2 karakters lang zijn'),
  email: z.string().email('Voer een geldig e-mailadres in'),
  password: z.string()
    .min(8, 'Wachtwoord moet minimaal 8 karakters lang zijn')
    .regex(/[A-Z]/, 'Wachtwoord moet minimaal één hoofdletter bevatten')
    .regex(/[a-z]/, 'Wachtwoord moet minimaal één kleine letter bevatten')
    .regex(/[0-9]/, 'Wachtwoord moet minimaal één cijfer bevatten'),
  confirmPassword: z.string(),
  phoneNumber: z.string()
    .regex(dutchPhoneRegex, 'Voer een geldig Nederlands telefoonnummer in')
    .optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Je moet akkoord gaan met de voorwaarden'
  }),
  marketingConsent: z.boolean().optional()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Wachtwoorden komen niet overeen',
  path: ['confirmPassword']
})

export const businessRegistrationSchema = z.object({
  // Personal info
  name: z.string().min(2, 'Naam moet minimaal 2 karakters lang zijn'),
  email: z.string().email('Voer een geldig e-mailadres in'),
  password: z.string()
    .min(8, 'Wachtwoord moet minimaal 8 karakters lang zijn')
    .regex(/[A-Z]/, 'Wachtwoord moet minimaal één hoofdletter bevatten')
    .regex(/[a-z]/, 'Wachtwoord moet minimaal één kleine letter bevatten')
    .regex(/[0-9]/, 'Wachtwoord moet minimaal één cijfer bevatten'),
  confirmPassword: z.string(),
  phoneNumber: z.string().regex(dutchPhoneRegex, 'Voer een geldig Nederlands telefoonnummer in'),
  
  // Business info
  businessName: z.string().min(2, 'Bedrijfsnaam moet minimaal 2 karakters lang zijn'),
  kvkNumber: z.string().regex(kvkNumberRegex, 'Voer een geldig KvK-nummer in (8 cijfers)'),
  btwNumber: z.string().regex(btwNumberRegex, 'Voer een geldig BTW-nummer in (bijv. NL123456789B01)').optional(),
  category: z.enum([
    'restaurant', 'retail', 'services', 'healthcare', 'fitness', 
    'beauty', 'automotive', 'construction', 'education', 'entertainment',
    'real-estate', 'technology', 'other'
  ], { required_error: 'Selecteer een bedrijfscategorie' }),
  description: z.string().min(20, 'Beschrijving moet minimaal 20 karakters lang zijn'),
  
  // Address info
  address: z.string().min(5, 'Voer een geldig adres in'),
  city: z.string().min(2, 'Voer een geldige stad in'),
  postalCode: z.string().regex(dutchPostalCodeRegex, 'Voer een geldige Nederlandse postcode in'),
  website: z.string().url('Voer een geldige website URL in').optional().or(z.literal('')),
  
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Je moet akkoord gaan met de voorwaarden'
  }),
  marketingConsent: z.boolean().optional()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Wachtwoorden komen niet overeen',
  path: ['confirmPassword']
})

// Business profile validation
export const businessProfileSchema = z.object({
  businessName: z.string().min(2, 'Bedrijfsnaam moet minimaal 2 karakters lang zijn'),
  description: z.string().min(20, 'Beschrijving moet minimaal 20 karakters lang zijn'),
  category: z.enum([
    'restaurant', 'retail', 'services', 'healthcare', 'fitness', 
    'beauty', 'automotive', 'construction', 'education', 'entertainment',
    'real-estate', 'technology', 'other'
  ]),
  contactInfo: z.object({
    email: z.string().email('Voer een geldig e-mailadres in'),
    phone: z.string().regex(dutchPhoneRegex, 'Voer een geldig Nederlands telefoonnummer in'),
    website: z.string().url('Voer een geldige website URL in').optional().or(z.literal('')),
    whatsapp: z.string().regex(dutchPhoneRegex, 'Voer een geldig WhatsApp nummer in').optional().or(z.literal(''))
  }),
  location: z.object({
    address: z.string().min(5, 'Voer een geldig adres in'),
    city: z.string().min(2, 'Voer een geldige stad in'),
    postalCode: z.string().regex(dutchPostalCodeRegex, 'Voer een geldige Nederlandse postcode in'),
    country: z.string().default('Nederland')
  }),
  operatingHours: z.object({
    monday: z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional()
    }),
    tuesday: z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional()
    }),
    wednesday: z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional()
    }),
    thursday: z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional()
    }),
    friday: z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional()
    }),
    saturday: z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional()
    }),
    sunday: z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional()
    })
  }),
  socialMedia: z.object({
    facebook: z.string().url('Voer een geldige Facebook URL in').optional().or(z.literal('')),
    instagram: z.string().url('Voer een geldige Instagram URL in').optional().or(z.literal('')),
    linkedin: z.string().url('Voer een geldige LinkedIn URL in').optional().or(z.literal('')),
    twitter: z.string().url('Voer een geldige Twitter URL in').optional().or(z.literal('')),
    tiktok: z.string().url('Voer een geldige TikTok URL in').optional().or(z.literal('')),
    youtube: z.string().url('Voer een geldige YouTube URL in').optional().or(z.literal(''))
  }).optional()
})

// Post validation
export const postSchema = z.object({
  title: z.string().min(5, 'Titel moet minimaal 5 karakters lang zijn').max(100, 'Titel mag maximaal 100 karakters lang zijn'),
  content: z.string().min(10, 'Inhoud moet minimaal 10 karakters lang zijn').max(2000, 'Inhoud mag maximaal 2000 karakters lang zijn'),
  type: z.enum(['standard', 'promotion', 'event', 'job', 'property', 'product', 'service', 'announcement']),
  tags: z.array(z.string()).max(10, 'Maximaal 10 tags toegestaan').optional(),
  price: z.object({
    amount: z.number().min(0, 'Prijs moet positief zijn'),
    currency: z.string().default('EUR'),
    isNegotiable: z.boolean().default(false)
  }).optional(),
  eventDetails: z.object({
    startDate: z.string(),
    endDate: z.string().optional(),
    location: z.string().min(5, 'Locatie moet minimaal 5 karakters lang zijn'),
    capacity: z.number().min(1, 'Capaciteit moet minimaal 1 zijn').optional(),
    price: z.object({
      amount: z.number().min(0, 'Prijs moet positief zijn'),
      currency: z.string().default('EUR'),
      isNegotiable: z.boolean().default(false)
    }).optional(),
    isOnline: z.boolean().default(false)
  }).optional(),
  jobDetails: z.object({
    position: z.string().min(5, 'Functietitel moet minimaal 5 karakters lang zijn'),
    type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
    salary: z.object({
      min: z.number().min(0, 'Minimum salaris moet positief zijn').optional(),
      max: z.number().min(0, 'Maximum salaris moet positief zijn').optional(),
      currency: z.string().default('EUR'),
      period: z.enum(['hour', 'month', 'year']).default('month')
    }).optional(),
    requirements: z.array(z.string()).min(1, 'Minimaal 1 vereiste nodig'),
    applicationDeadline: z.string().optional()
  }).optional(),
  propertyDetails: z.object({
    type: z.enum(['apartment', 'house', 'commercial', 'land']),
    listingType: z.enum(['sale', 'rent']),
    price: z.object({
      amount: z.number().min(0, 'Prijs moet positief zijn'),
      currency: z.string().default('EUR'),
      isNegotiable: z.boolean().default(false)
    }),
    size: z.number().min(1, 'Oppervlakte moet minimaal 1 m² zijn'),
    rooms: z.number().min(1, 'Minimaal 1 kamer').optional(),
    bathrooms: z.number().min(1, 'Minimaal 1 badkamer').optional(),
    features: z.array(z.string()).optional(),
    availableFrom: z.string().optional()
  }).optional()
})

// Review validation
export const reviewSchema = z.object({
  rating: z.number().min(1, 'Minimale rating is 1').max(5, 'Maximale rating is 5'),
  title: z.string().min(5, 'Titel moet minimaal 5 karakters lang zijn').max(100, 'Titel mag maximaal 100 karakters lang zijn'),
  content: z.string().min(10, 'Review moet minimaal 10 karakters lang zijn').max(1000, 'Review mag maximaal 1000 karakters lang zijn')
})

// Contact form validation
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Naam moet minimaal 2 karakters lang zijn'),
  email: z.string().email('Voer een geldig e-mailadres in'),
  phone: z.string().regex(dutchPhoneRegex, 'Voer een geldig Nederlands telefoonnummer in').optional(),
  subject: z.string().min(5, 'Onderwerp moet minimaal 5 karakters lang zijn'),
  message: z.string().min(10, 'Bericht moet minimaal 10 karakters lang zijn').max(1000, 'Bericht mag maximaal 1000 karakters lang zijn')
})

// Payment validation
export const paymentMethodSchema = z.object({
  type: z.enum(['card', 'bank', 'ideal', 'paypal']),
  cardNumber: z.string().regex(/^[0-9]{13,19}$/, 'Voer een geldig kaartnummer in').optional(),
  expiryMonth: z.number().min(1).max(12).optional(),
  expiryYear: z.number().min(new Date().getFullYear()).optional(),
  cvv: z.string().regex(/^[0-9]{3,4}$/, 'Voer een geldige CVV in').optional(),
  cardholderName: z.string().min(2, 'Voer de naam van de kaarthouder in').optional(),
  idealBank: z.string().optional()
})

// Campaign validation
export const campaignSchema = z.object({
  name: z.string().min(5, 'Campagnenaam moet minimaal 5 karakters lang zijn'),
  type: z.enum(['awareness', 'traffic', 'engagement', 'leads', 'conversions', 'app_promotion']),
  budget: z.object({
    total: z.number().min(10, 'Minimum budget is €10'),
    currency: z.string().default('EUR')
  }),
  targeting: z.object({
    location: z.object({
      cities: z.array(z.string()).min(1, 'Selecteer minimaal 1 stad'),
      radius: z.number().min(1).max(100, 'Radius moet tussen 1 en 100 km zijn')
    }),
    demographics: z.object({
      ageRange: z.object({
        min: z.number().min(13).max(99),
        max: z.number().min(13).max(99)
      }).optional(),
      interests: z.array(z.string()).optional()
    })
  }),
  content: z.object({
    headline: z.string().min(10, 'Headline moet minimaal 10 karakters lang zijn').max(60, 'Headline mag maximaal 60 karakters lang zijn'),
    description: z.string().min(20, 'Beschrijving moet minimaal 20 karakters lang zijn').max(200, 'Beschrijving mag maximaal 200 karakters lang zijn'),
    callToAction: z.string().min(3, 'Call-to-action moet minimaal 3 karakters lang zijn').max(20, 'Call-to-action mag maximaal 20 karakters lang zijn'),
    landingUrl: z.string().url('Voer een geldige URL in').optional()
  }),
  schedule: z.object({
    startDate: z.string(),
    endDate: z.string().optional(),
    isAlwaysOn: z.boolean().default(false)
  })
})

// Search validation
export const searchSchema = z.object({
  query: z.string().max(100, 'Zoekopdracht mag maximaal 100 karakters lang zijn').optional(),
  category: z.enum([
    'restaurant', 'retail', 'services', 'healthcare', 'fitness', 
    'beauty', 'automotive', 'construction', 'education', 'entertainment',
    'real-estate', 'technology', 'other'
  ]).optional(),
  location: z.string().max(100, 'Locatie mag maximaal 100 karakters lang zijn').optional(),
  radius: z.number().min(1).max(100, 'Radius moet tussen 1 en 100 km zijn').optional(),
  priceRange: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional()
  }).optional(),
  rating: z.number().min(1).max(5).optional(),
  verified: z.boolean().optional(),
  openNow: z.boolean().optional()
})

// File upload validation
export const fileUploadSchema = z.object({
  file: z.object({
    name: z.string(),
    size: z.number().max(10 * 1024 * 1024, 'Bestand mag maximaal 10MB groot zijn'), // 10MB
    type: z.string().refine(type => 
      ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'application/pdf'].includes(type),
      'Alleen JPEG, PNG, WebP, MP4, WebM en PDF bestanden zijn toegestaan'
    )
  }),
  title: z.string().max(100, 'Titel mag maximaal 100 karakters lang zijn').optional(),
  description: z.string().max(500, 'Beschrijving mag maximaal 500 karakters lang zijn').optional()
})

// Validation helper functions
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateDutchPhone(phone: string): boolean {
  return dutchPhoneRegex.test(phone)
}

export function validateDutchPostalCode(postalCode: string): boolean {
  return dutchPostalCodeRegex.test(postalCode)
}

export function validateKvKNumber(kvkNumber: string): boolean {
  return kvkNumberRegex.test(kvkNumber)
}

export function validateBTWNumber(btwNumber: string): boolean {
  return btwNumberRegex.test(btwNumber)
}

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Wachtwoord moet minimaal 8 karakters lang zijn')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Wachtwoord moet minimaal één hoofdletter bevatten')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Wachtwoord moet minimaal één kleine letter bevatten')
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Wachtwoord moet minimaal één cijfer bevatten')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Content moderation
export function validateContent(content: string): { isValid: boolean; issues: string[] } {
  const issues: string[] = []
  const lowercaseContent = content.toLowerCase()
  
  // Basic profanity filter (Dutch)
  const profanityWords = [
    'kanker', 'kut', 'shit', 'fuck', 'godverdomme', 'klootzak', 'hoer', 'lul'
  ]
  
  profanityWords.forEach(word => {
    if (lowercaseContent.includes(word)) {
      issues.push('Inhoud bevat mogelijk ongepaste taal')
    }
  })
  
  // Spam detection
  if (content.includes('http://') || content.includes('https://')) {
    if ((content.match(/http/g) || []).length > 2) {
      issues.push('Te veel links gedetecteerd')
    }
  }
  
  // Repeated characters
  if (/(.)\1{4,}/.test(content)) {
    issues.push('Te veel herhalende karakters gedetecteerd')
  }
  
  // All caps
  if (content.length > 20 && content === content.toUpperCase()) {
    issues.push('Vermijd volledig hoofdletters')
  }
  
  return {
    isValid: issues.length === 0,
    issues
  }
}

// Export type helpers
export type LoginForm = z.infer<typeof loginSchema>
export type PersonalRegistrationForm = z.infer<typeof personalRegistrationSchema>
export type BusinessRegistrationForm = z.infer<typeof businessRegistrationSchema>
export type BusinessProfileForm = z.infer<typeof businessProfileSchema>
export type PostForm = z.infer<typeof postSchema>
export type ReviewForm = z.infer<typeof reviewSchema>
export type ContactForm = z.infer<typeof contactFormSchema>
export type PaymentMethodForm = z.infer<typeof paymentMethodSchema>
export type CampaignForm = z.infer<typeof campaignSchema>
export type SearchForm = z.infer<typeof searchSchema>
export type FileUploadForm = z.infer<typeof fileUploadSchema>