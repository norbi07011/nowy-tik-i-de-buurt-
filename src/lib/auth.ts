import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export interface AuthUser {
  id: string
  name: string
  email: string
  accountType: 'user' | 'business'
  profileImage?: string
  createdAt: string
  businessName?: string
  category?: string
  isVerified?: boolean
  isPremium?: boolean
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<AuthUser | null> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      console.error('Authentication error:', authError)
      toast.error('Nieprawidłowy email lub hasło')
      return null
    }

    // Fetch user profile from database
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        *,
        business_profiles (*)
      `)
      .eq('id', authData.user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      toast.error('Błąd podczas pobierania profilu')
      return null
    }

    // Map database profile to AuthUser
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      accountType: profile.account_type,
      profileImage: profile.profile_image || '',
      createdAt: profile.created_at,
      ...(profile.business_profiles && profile.business_profiles.length > 0 ? {
        businessName: profile.business_profiles[0].business_name,
        category: profile.business_profiles[0].category,
        isVerified: profile.business_profiles[0].is_verified,
        isPremium: profile.business_profiles[0].is_premium
      } : {})
    }
  } catch (error) {
    console.error('Sign in error:', error)
    toast.error('Błąd podczas logowania')
    return null
  }
}

/**
 * Sign up new user
 */
export async function signUp(
  email: string,
  password: string,
  name: string,
  accountType: 'user' | 'business',
  businessData?: {
    businessName: string
    ownerName: string
    phone?: string
    address?: string
    category?: string
    description?: string
    website?: string
  }
): Promise<AuthUser | null> {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          account_type: accountType
        }
      }
    })

    if (authError) {
      console.error('❌ Auth error:', authError)
      toast.error(authError.message)
      return null
    }

    if (!authData.user) {
      console.error('❌ No user data returned')
      toast.error('Nie udało się utworzyć konta')
      return null
    }

    console.log('✅ User created in auth:', authData.user.id)
    console.log('📧 Email confirmed:', authData.user.email_confirmed_at)
    console.log('🔑 Session:', authData.session ? 'YES' : 'NO')

    // Create profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        name,
        account_type: accountType
      })
      .select()

    if (profileError) {
      console.error('❌ Profile creation error:', profileError)
      console.error('❌ Error details:', JSON.stringify(profileError, null, 2))
      toast.error(`Błąd podczas tworzenia profilu: ${profileError.message}`)
      return null
    }

    console.log('✅ Profile created:', profileData)

    // Create business profile if needed
    if (accountType === 'business' && businessData) {
      const { error: businessError } = await supabase
        .from('business_profiles')
        .insert({
          user_id: authData.user.id,
          business_name: businessData.businessName,
          owner_name: businessData.ownerName,
          phone: businessData.phone,
          address: businessData.address,
          category: businessData.category,
          description: businessData.description,
          website: businessData.website,
          is_verified: true,
          is_premium: true
        })

      if (businessError) {
        console.error('Business profile creation error:', businessError)
      }
    }

    return {
      id: authData.user.id,
      name,
      email,
      accountType,
      profileImage: '',
      createdAt: new Date().toISOString(),
      ...(businessData ? {
        businessName: businessData.businessName,
        category: businessData.category,
        isVerified: true,
        isPremium: true
      } : {})
    }
  } catch (error) {
    console.error('Sign up error:', error)
    toast.error('Błąd podczas rejestracji')
    return null
  }
}

/**
 * Sign out current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Sign out error:', error)
    toast.error('Błąd podczas wylogowania')
  }
}

/**
 * Get current session
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      *,
      business_profiles (*)
    `)
    .eq('id', session.user.id)
    .single()

  if (!profile) {
    return null
  }

  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    accountType: profile.account_type,
    profileImage: profile.profile_image || '',
    createdAt: profile.created_at,
    ...(profile.business_profiles && profile.business_profiles.length > 0 ? {
      businessName: profile.business_profiles[0].business_name,
      category: profile.business_profiles[0].category,
      isVerified: profile.business_profiles[0].is_verified,
      isPremium: profile.business_profiles[0].is_premium
    } : {})
  }
}

