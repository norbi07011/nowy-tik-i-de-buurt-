import { z } from 'zod'

// Base validation schemas
export const emailSchema = z.string().email('Ongeldig e-mailadres')
export const phoneSchema = z.string().regex(/^(\+31|0)[0-9]{9}$/, 'Ongeldig Nederlands telefoonnummer')
export const passwordSchema = z.string().min(8, 'Wachtwoord moet minimaal 8 karakters bevatten')
export const urlSchema = z.string().url('Ongeldige URL').optional().or(z.literal(''))
export const dutchPostalCodeSchema = z.string().regex(/^[1-9][0-9]{3}\s?[A-Z]{2}$/i, 'Ongeldige Nederlandse postcode')

// User registration schemas
export const userRegistrationSchema = z.object({
  name: z.string().min(2, 'Naam moet minimaal 2 karakters bevatten'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  accountType: z.enum(['personal', 'business']),
  agreeToTerms: z.boolean().refine(val => val === true, 'U moet akkoord gaan met de voorwaarden')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Wachtwoorden komen niet overeen',
  path: ['confirmPassword']
})

export const businessRegistrationSchema = z.object({
  name: z.string().min(2, 'Naam moet minimaal 2 karakters bevatten'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  accountType: z.enum(['personal', 'business']),
  agreeToTerms: z.boolean().refine(val => val === true, 'U moet akkoord gaan met de voorwaarden'),
  businessName: z.string().min(2, 'Bedrijfsnaam moet minimaal 2 karakters bevatten'),
  category: z.string().min(1, 'Selecteer een categorie'),
  address: z.string().min(5, 'Adres moet minimaal 5 karakters bevatten'),
  phone: phoneSchema,
  description: z.string().min(10, 'Beschrijving moet minimaal 10 karakters bevatten').max(500, 'Beschrijving mag maximaal 500 karakters bevatten'),
  website: urlSchema,
  kvkNumber: z.string().regex(/^[0-9]{8}$/, 'KvK-nummer moet 8 cijfers bevatten').optional(),
  vatNumber: z.string().regex(/^NL[0-9]{9}B[0-9]{2}$/, 'Ongeldig BTW-nummer').optional()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Wachtwoorden komen niet overeen',
  path: ['confirmPassword']
})

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Wachtwoord is verplicht')
})

// Business profile schemas
export const businessHoursSchema = z.object({
  monday: z.object({ open: z.string(), close: z.string(), closed: z.boolean() }),
  tuesday: z.object({ open: z.string(), close: z.string(), closed: z.boolean() }),
  wednesday: z.object({ open: z.string(), close: z.string(), closed: z.boolean() }),
  thursday: z.object({ open: z.string(), close: z.string(), closed: z.boolean() }),
  friday: z.object({ open: z.string(), close: z.string(), closed: z.boolean() }),
  saturday: z.object({ open: z.string(), close: z.string(), closed: z.boolean() }),
  sunday: z.object({ open: z.string(), close: z.string(), closed: z.boolean() })
})

export const socialMediaSchema = z.object({
  facebook: urlSchema,
  instagram: urlSchema,
  twitter: urlSchema,
  linkedin: urlSchema,
  youtube: urlSchema,
  tiktok: urlSchema
})

export const businessProfileSchema = z.object({
  name: z.string().min(2, 'Bedrijfsnaam moet minimaal 2 karakters bevatten'),
  category: z.string().min(1, 'Selecteer een categorie'),
  description: z.string().min(10, 'Beschrijving moet minimaal 10 karakters bevatten').max(1000, 'Beschrijving mag maximaal 1000 karakters bevatten'),
  address: z.string().min(5, 'Adres moet minimaal 5 karakters bevatten'),
  phone: phoneSchema,
  email: emailSchema,
  website: urlSchema,
  businessHours: businessHoursSchema.optional(),
  socialMedia: socialMediaSchema.optional(),
  services: z.array(z.string()).max(10, 'Maximaal 10 diensten toegestaan').optional(),
  tags: z.array(z.string()).max(15, 'Maximaal 15 tags toegestaan').optional(),
  specialties: z.string().max(300, 'Specialiteiten mogen maximaal 300 karakters bevatten').optional()
})

// Post creation schema
export const businessPostSchema = z.object({
  title: z.string().min(5, 'Titel moet minimaal 5 karakters bevatten').max(100, 'Titel mag maximaal 100 karakters bevatten'),
  description: z.string().min(10, 'Beschrijving moet minimaal 10 karakters bevatten').max(2000, 'Beschrijving mag maximaal 2000 karakters bevatten'),
  category: z.enum(['announcement', 'promotion', 'event', 'job', 'news', 'product']),
  tags: z.array(z.string()).max(5, 'Maximaal 5 tags toegestaan').optional(),
  location: z.string().optional(),
  eventDate: z.string().optional(),
  price: z.number().min(0, 'Prijs kan niet negatief zijn').optional(),
  contactInfo: z.object({
    phone: phoneSchema.optional(),
    email: emailSchema.optional(),
    website: urlSchema.optional()
  }).optional()
})

// Review schema
export const reviewSchema = z.object({
  rating: z.number().min(1, 'Beoordeling moet minimaal 1 ster zijn').max(5, 'Beoordeling mag maximaal 5 sterren zijn'),
  comment: z.string().min(10, 'Review moet minimaal 10 karakters bevatten').max(1000, 'Review mag maximaal 1000 karakters bevatten'),
  visitDate: z.string().optional(),
  recommendToFriends: z.boolean().optional()
})

// Payment method schema
export const paymentMethodSchema = z.object({
  type: z.enum(['card', 'bank', 'paypal']),
  cardNumber: z.string().regex(/^[0-9\s]{13,19}$/, 'Ongeldig kaartnummer').optional(),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Ongeldige vervaldatum (MM/JJ)').optional(),
  cvv: z.string().regex(/^[0-9]{3,4}$/, 'Ongeldige CVV').optional(),
  cardholderName: z.string().min(2, 'Naam moet minimaal 2 karakters bevatten').optional(),
  iban: z.string().regex(/^NL[0-9]{2}[A-Z]{4}[0-9]{10}$/, 'Ongeldig Nederlands IBAN').optional(),
  accountHolderName: z.string().min(2, 'Naam moet minimaal 2 karakters bevatten').optional()
})

// Campaign creation schema
export const campaignSchema = z.object({
  title: z.string().min(5, 'Titel moet minimaal 5 karakters bevatten').max(100, 'Titel mag maximaal 100 karakters bevatten'),
  description: z.string().min(10, 'Beschrijving moet minimaal 10 karakters bevatten').max(500, 'Beschrijving mag maximaal 500 karakters bevatten'),
  type: z.enum(['promotion', 'event', 'announcement', 'job_posting']),
  startDate: z.string().refine(date => new Date(date) >= new Date(), 'Startdatum kan niet in het verleden zijn'),
  endDate: z.string(),
  budget: z.number().min(10, 'Budget moet minimaal €10 zijn').max(10000, 'Budget mag maximaal €10.000 zijn'),
  targetAudience: z.object({
    location: z.string().optional(),
    ageRange: z.tuple([z.number().min(18), z.number().max(99)]).optional(),
    interests: z.array(z.string()).max(10, 'Maximaal 10 interesses toegestaan').optional()
  }).optional(),
  callToAction: z.string().min(3, 'Call-to-action moet minimaal 3 karakters bevatten').max(50, 'Call-to-action mag maximaal 50 karakters bevatten')
}).refine(data => new Date(data.endDate) > new Date(data.startDate), {
  message: 'Einddatum moet na startdatum zijn',
  path: ['endDate']
})

// Message schema
export const messageSchema = z.object({
  content: z.string().min(1, 'Bericht kan niet leeg zijn').max(2000, 'Bericht mag maximaal 2000 karakters bevatten'),
  type: z.enum(['text', 'image', 'file']).default('text'),
  subject: z.string().max(100, 'Onderwerp mag maximaal 100 karakters bevatten').optional()
})

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Naam moet minimaal 2 karakters bevatten'),
  email: emailSchema,
  phone: phoneSchema.optional(),
  subject: z.string().min(5, 'Onderwerp moet minimaal 5 karakters bevatten').max(100, 'Onderwerp mag maximaal 100 karakters bevatten'),
  message: z.string().min(10, 'Bericht moet minimaal 10 karakters bevatten').max(1000, 'Bericht mag maximaal 1000 karakters bevatten'),
  businessId: z.string(),
  preferredContactMethod: z.enum(['email', 'phone', 'no_preference']).default('email')
})

// Search and filter schemas
export const searchSchema = z.object({
  query: z.string().max(100, 'Zoekopdracht mag maximaal 100 karakters bevatten').optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  radius: z.number().min(1).max(50).optional(), // km
  rating: z.number().min(1).max(5).optional(),
  priceRange: z.enum(['budget', 'mid', 'premium', 'all']).optional(),
  openNow: z.boolean().optional(),
  hasPhotos: z.boolean().optional(),
  hasReviews: z.boolean().optional(),
  sortBy: z.enum(['relevance', 'distance', 'rating', 'newest', 'oldest']).default('relevance')
})

// Settings schemas
export const notificationPreferencesSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  sms: z.boolean(),
  categories: z.object({
    messages: z.boolean(),
    reviews: z.boolean(),
    payments: z.boolean(),
    marketing: z.boolean(),
    analytics: z.boolean(),
    system: z.boolean()
  })
})

export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(['public', 'business_users_only', 'private']),
  showContactInfo: z.boolean(),
  allowMessagesFromUsers: z.boolean(),
  showBusinessHours: z.boolean(),
  showLastActive: z.boolean(),
  dataProcessingConsent: z.boolean(),
  marketingConsent: z.boolean()
})

// File upload schema
export const fileUploadSchema = z.object({
  type: z.enum(['image', 'video', 'document']),
  maxSize: z.number().default(5 * 1024 * 1024), // 5MB default
  allowedFormats: z.array(z.string()).default([]),
  description: z.string().max(200, 'Beschrijving mag maximaal 200 karakters bevatten').optional(),
  category: z.string().optional()
})

// Export type definitions
export type UserRegistrationData = z.infer<typeof userRegistrationSchema>
export type BusinessRegistrationData = z.infer<typeof businessRegistrationSchema>
export type LoginData = z.infer<typeof loginSchema>
export type BusinessProfileData = z.infer<typeof businessProfileSchema>
export type BusinessPostData = z.infer<typeof businessPostSchema>
export type ReviewData = z.infer<typeof reviewSchema>
export type PaymentMethodData = z.infer<typeof paymentMethodSchema>
export type CampaignData = z.infer<typeof campaignSchema>
export type MessageData = z.infer<typeof messageSchema>
export type ContactFormData = z.infer<typeof contactFormSchema>
export type SearchData = z.infer<typeof searchSchema>
export type NotificationPreferencesData = z.infer<typeof notificationPreferencesSchema>
export type PrivacySettingsData = z.infer<typeof privacySettingsSchema>
export type FileUploadData = z.infer<typeof fileUploadSchema>

// Validation utility functions
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: string[] } => {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => err.message)
      return { success: false, errors }
    }
    return { success: false, errors: ['Onbekende validatiefout'] }
  }
}

export const getFieldError = (errors: z.ZodError, fieldName: string): string | undefined => {
  const fieldError = errors.errors.find(error => 
    error.path.length > 0 && error.path[0] === fieldName
  )
  return fieldError?.message
}

// Business category validation
export const businessCategories = [
  'restaurant', 'cafe', 'bar', 'retail', 'supermarket', 'electronics',
  'clothing', 'beauty', 'fitness', 'healthcare', 'dentist', 'pharmacy',
  'automotive', 'garage', 'gas_station', 'education', 'school', 'training',
  'technology', 'software', 'consulting', 'finance', 'bank', 'insurance',
  'real_estate', 'construction', 'plumbing', 'electrical', 'cleaning',
  'legal', 'accounting', 'marketing', 'photography', 'event_planning',
  'travel', 'hotel', 'entertainment', 'sports', 'music', 'art', 'other'
] as const

export type BusinessCategory = typeof businessCategories[number]

export const businessCategorySchema = z.enum(businessCategories)

// Dutch cities for location validation
export const dutchCities = [
  'Amsterdam', 'Rotterdam', 'Den Haag', 'Utrecht', 'Eindhoven', 'Groningen',
  'Tilburg', 'Almere', 'Breda', 'Nijmegen', 'Apeldoorn', 'Haarlem',
  'Arnhem', 'Amersfoort', 'Zaanstad', 'Haarlemmermeer', 'Zoetermeer',
  'Zwolle', 'Maastricht', 'Leiden', 'Dordrecht', 'Ede', 'Alphen aan den Rijn',
  'Westland', 'Alkmaar', 'Leeuwarden', 'Venlo', 'Helmond', 'Delft'
] as const

export type DutchCity = typeof dutchCities[number]

export const dutchCitySchema = z.enum(dutchCities)