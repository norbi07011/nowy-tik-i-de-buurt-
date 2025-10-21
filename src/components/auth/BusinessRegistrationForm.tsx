import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Building, Eye, EyeSlash, Envelope, Lock, MapPin, Phone, Globe } from "@phosphor-icons/react"
import { useTranslation } from "@/hooks/use-translation"
import { signUp } from "@/lib/auth"

interface BusinessRegistrationFormProps {
  onRegister: (business: any) => void
  onSwitchToLogin: () => void
}

export function BusinessRegistrationForm({ onRegister, onSwitchToLogin }: BusinessRegistrationFormProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    category: "",
    description: "",
    website: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<any[]>([])

  // Load users from localStorage
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem('registered-users')
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers))
      }
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const businessCategories = [
    "Restauracja", "Usługi", "Handel", "Zdrowie", "Edukacja", 
    "IT", "Budowlanka", "Transport", "Rozrywka", "Inne"
  ]

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🔥 BusinessRegistrationForm: handleRegister wywołane')
    
    // Sprawdź czy wszystkie wymagane pola są wypełnione
    if (!formData.businessName || !formData.ownerName || !formData.email || !formData.password || !formData.phone || !formData.address || !formData.category) {
      toast.error("Proszę wypełnić wszystkie wymagane pola")
      return
    }

    setIsLoading(true)

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        toast.error("Hasła nie są identyczne")
        setIsLoading(false)
        return
      }

      if (formData.password.length < 6) {
        toast.error("Hasło musi mieć minimum 6 znaków")
        setIsLoading(false)
        return
      }

      // Sprawdź czy email jest już zajęty
      const existingUser = users.find(user => user.email === formData.email)
      if (existingUser) {
        toast.error("Ten adres email jest już zajęty")
        setIsLoading(false)
        return
      }

      console.log('✅ Walidacja przeszła, tworzenie konta biznesowego w Supabase...')

      const result = await signUp(
        formData.email,
        formData.password,
        formData.ownerName,
        'business',
        {
          businessName: formData.businessName,
          ownerName: formData.ownerName,
          phone: formData.phone,
          address: formData.address,
          category: formData.category,
          description: formData.description,
          website: formData.website
        }
      )

      if (result) {
        console.log('🏢 Konto biznesowe utworzone w Supabase:', result)
        toast.success("🎉 Konto biznesowe zostało utworzone! Witaj w premium społeczności biznesowej!")
        onRegister(result)
      } else {
        toast.error("Błąd podczas tworzenia konta biznesowego")
      }
    } catch (error) {
      console.error('❌ Błąd podczas rejestracji biznesowej:', error)
      toast.error("Błąd podczas rejestracji")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.form 
      onSubmit={handleRegister} 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div 
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div
          className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center mb-4"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <Building className="w-8 h-8 text-slate-800" />
        </motion.div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Zarejestruj biznes</h3>
        <p className="text-slate-600">Stwórz swoje premium konto biznesowe</p>
      </motion.div>

      {/* Business Name */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Label htmlFor="businessName" className="text-slate-800 font-medium">
          Nazwa firmy
        </Label>
        <div className="relative">
          <motion.div
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500"
            whileHover={{ scale: 1.1 }}
          >
            <Building className="w-5 h-5" />
          </motion.div>
          <Input
            id="businessName"
            type="text"
            value={formData.businessName}
            onChange={(e) => handleInputChange("businessName", e.target.value)}
            className="pl-12 bg-white/10 border-white/20 text-slate-800 placeholder:text-slate-800/50 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-2xl h-12 transition-all duration-300"
            placeholder="Twoja Firma Sp. z o.o."
            required
          />
        </div>
      </motion.div>

      {/* Owner Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Label htmlFor="ownerName" className="text-slate-800 font-medium">
            Właściciel
          </Label>
          <Input
            id="ownerName"
            type="text"
            value={formData.ownerName}
            onChange={(e) => handleInputChange("ownerName", e.target.value)}
            className="bg-white/10 border-white/20 text-slate-800 placeholder:text-slate-800/50 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-2xl h-12 transition-all duration-300"
            placeholder="Jan Kowalski"
            required
          />
        </motion.div>

        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Label htmlFor="email" className="text-slate-800 font-medium">
            Email biznesowy
          </Label>
          <div className="relative">
            <motion.div
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500"
              whileHover={{ scale: 1.1 }}
            >
              <Envelope className="w-5 h-5" />
            </motion.div>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="pl-12 bg-white/10 border-white/20 text-slate-800 placeholder:text-slate-800/50 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-2xl h-12 transition-all duration-300"
              placeholder="kontakt@twojafirma.pl"
              required
            />
          </div>
        </motion.div>
      </div>

      {/* Phone & Address */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Label htmlFor="phone" className="text-slate-800 font-medium">
            Telefon
          </Label>
          <div className="relative">
            <motion.div
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500"
              whileHover={{ scale: 1.1 }}
            >
              <Phone className="w-5 h-5" />
            </motion.div>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="pl-12 bg-white/10 border-white/20 text-slate-800 placeholder:text-slate-800/50 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-2xl h-12 transition-all duration-300"
              placeholder="+48 123 456 789"
              required
            />
          </div>
        </motion.div>

        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Label htmlFor="address" className="text-slate-800 font-medium">
            Adres
          </Label>
          <div className="relative">
            <motion.div
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500"
              whileHover={{ scale: 1.1 }}
            >
              <MapPin className="w-5 h-5" />
            </motion.div>
            <Input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="pl-12 bg-white/10 border-white/20 text-slate-800 placeholder:text-slate-800/50 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-2xl h-12 transition-all duration-300"
              placeholder="ul. Przykładowa 1, Warszawa"
              required
            />
          </div>
        </motion.div>
      </div>

      {/* Category & Website */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Label htmlFor="category" className="text-slate-800 font-medium">
            Kategoria
          </Label>
          <select
            id="category"
            title="Wybierz kategorię firmy"
            value={formData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            className="w-full bg-white/10 border border-white/20 text-slate-800 rounded-2xl h-12 px-4 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all duration-300"
            required
          >
            <option value="" className="bg-gray-800">Wybierz kategorię</option>
            {businessCategories.map((cat) => (
              <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
            ))}
          </select>
        </motion.div>

        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Label htmlFor="website" className="text-slate-800 font-medium">
            Strona internetowa (opcjonalne)
          </Label>
          <div className="relative">
            <motion.div
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500"
              whileHover={{ scale: 1.1 }}
            >
              <Globe className="w-5 h-5" />
            </motion.div>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              className="pl-12 bg-white/10 border-white/20 text-slate-800 placeholder:text-slate-800/50 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-2xl h-12 transition-all duration-300"
              placeholder="https://twojafirma.pl"
            />
          </div>
        </motion.div>
      </div>

      {/* Description */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Label htmlFor="description" className="text-slate-800 font-medium">
          Opis firmy
        </Label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="w-full bg-white/10 border border-white/20 text-slate-800 placeholder:text-slate-800/50 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-2xl p-4 h-24 resize-none transition-all duration-300"
          placeholder="Opisz swoją firmę, usługi i to co wyróżnia Cię na rynku..."
          required
        />
      </motion.div>

      {/* Password Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Label htmlFor="password" className="text-slate-800 font-medium">
            Hasło
          </Label>
          <div className="relative">
            <motion.div
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500"
              whileHover={{ scale: 1.1 }}
            >
              <Lock className="w-5 h-5" />
            </motion.div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="pl-12 pr-12 bg-white/10 border-white/20 text-slate-800 placeholder:text-slate-800/50 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-2xl h-12 transition-all duration-300"
              placeholder="••••••••"
              required
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {showPassword ? <EyeSlash className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Label htmlFor="confirmPassword" className="text-slate-800 font-medium">
            Potwierdź hasło
          </Label>
          <div className="relative">
            <motion.div
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500"
              whileHover={{ scale: 1.1 }}
            >
              <Lock className="w-5 h-5" />
            </motion.div>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              className="pl-12 pr-12 bg-white/10 border-white/20 text-slate-800 placeholder:text-slate-800/50 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-2xl h-12 transition-all duration-300"
              placeholder="••••••••"
              required
            />
            <motion.button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {showConfirmPassword ? <EyeSlash className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Register Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full btn-elegant h-12 text-lg font-semibold relative overflow-hidden"
          onClick={(e) => {
            console.log('🎯 Kliknięto przycisk Utwórz konto biznesowe')
            console.log('🎯 isLoading:', isLoading)
            console.log('🎯 formData:', formData)
          }}
        >
          {isLoading ? (
            <motion.div 
              className="flex items-center gap-3"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Tworzenie konta biznesowego...
            </motion.div>
          ) : (
            "Utwórz konto biznesowe"
          )}
        </Button>
      </motion.div>

      {/* Login Link */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        <p className="text-slate-600">
          Masz już konto?{" "}
          <motion.button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('⬅️ Kliknięto Zaloguj się (BusinessReg)')
              onSwitchToLogin()
            }}
            className="text-purple-400 hover:text-purple-300 font-semibold transition-colors underline underline-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Zaloguj się
          </motion.button>
        </p>
      </motion.div>
    </motion.form>
  )
}
