import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { User, Eye, EyeSlash, Envelope, Lock, UserCircle, Calendar } from "@phosphor-icons/react"
import { useTranslation } from "@/hooks/use-translation"

interface UserRegistrationFormProps {
  onRegister: (user: any) => void
  onSwitchToLogin: () => void
}

export function UserRegistrationForm({ onRegister, onSwitchToLogin }: UserRegistrationFormProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    interests: "",
    phone: "",
    city: ""
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🔥 UserRegistrationForm: handleRegister wywołane')
    
    // Sprawdź czy wszystkie wymagane pola są wypełnione
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.age) {
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

      const ageNum = parseInt(formData.age)
      if (isNaN(ageNum) || ageNum < 13 || ageNum > 120) {
        toast.error("Wiek musi być liczbą między 13 a 120")
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

      console.log('✅ Walidacja przeszła, tworzenie użytkownika...')

      // Simulate premium registration process
      await new Promise(resolve => setTimeout(resolve, 2000))

      const newUser = {
        id: Date.now().toString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        age: formData.age,
        interests: formData.interests,
        phone: formData.phone || "",
        city: formData.city || "",
        accountType: 'user',
        profileImage: '',
        bio: '',
        createdAt: new Date().toISOString(),
        isPremium: true
      }

      console.log('👤 Nowy użytkownik utworzony:', newUser)

      // Save to localStorage
      const updatedUsers = [...(users || []), newUser]
      localStorage.setItem('registered-users', JSON.stringify(updatedUsers))
      setUsers(updatedUsers)

      toast.success("🎉 Konto zostało utworzone! Witaj w premium społeczności!")
      onRegister(newUser)
    } catch (error) {
      console.error('❌ Błąd podczas rejestracji:', error)
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
          <UserCircle className="w-8 h-8 text-slate-800" />
        </motion.div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Dołącz do społeczności</h3>
        <p className="text-slate-600">Stwórz swoje premium konto użytkownika</p>
      </motion.div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Label htmlFor="firstName" className="text-slate-800 font-medium">
            Imię
          </Label>
          <div className="relative">
            <motion.div
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500"
              whileHover={{ scale: 1.1 }}
            >
              <User className="w-5 h-5" />
            </motion.div>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="pl-12 bg-white/10 border-white/20 text-slate-800 placeholder:text-slate-800/50 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-2xl h-12 transition-all duration-300"
              placeholder="Jan"
              required
            />
          </div>
        </motion.div>

        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Label htmlFor="lastName" className="text-slate-800 font-medium">
            Nazwisko
          </Label>
          <Input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className="bg-white/10 border-white/20 text-slate-800 placeholder:text-slate-800/50 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-2xl h-12 transition-all duration-300"
            placeholder="Kowalski"
            required
          />
        </motion.div>
      </div>

      {/* Email Field */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Label htmlFor="email" className="text-slate-800 font-medium">
          Adres email
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
            placeholder="twoj@email.com"
            required
          />
        </div>
      </motion.div>

      {/* Age Field */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Label htmlFor="age" className="text-slate-800 font-medium">
          Wiek
        </Label>
        <div className="relative">
          <motion.div
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500"
            whileHover={{ scale: 1.1 }}
          >
            <Calendar className="w-5 h-5" />
          </motion.div>
          <Input
            id="age"
            type="number"
            min="13"
            max="120"
            value={formData.age}
            onChange={(e) => handleInputChange("age", e.target.value)}
            className="pl-12 bg-white/10 border-white/20 text-slate-800 placeholder:text-slate-800/50 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-2xl h-12 transition-all duration-300"
            placeholder="25"
            required
          />
        </div>
      </motion.div>

      {/* Password Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
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
          transition={{ delay: 0.6 }}
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

      {/* Phone & City Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.65 }}
        >
          <Label htmlFor="phone" className="text-slate-800 font-medium">
            Telefon (opcjonalnie)
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="bg-white/10 border-white/20 text-slate-800 placeholder:text-slate-800/50 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-2xl h-12 transition-all duration-300"
            placeholder="+48 123 456 789"
          />
        </motion.div>

        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.68 }}
        >
          <Label htmlFor="city" className="text-slate-800 font-medium">
            Miasto (opcjonalnie)
          </Label>
          <Input
            id="city"
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            className="bg-white/10 border-white/20 text-slate-800 placeholder:text-slate-800/50 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-2xl h-12 transition-all duration-300"
            placeholder="Warszawa"
          />
        </motion.div>
      </div>

      {/* Interests Field */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Label htmlFor="interests" className="text-slate-800 font-medium">
          Zainteresowania (opcjonalne)
        </Label>
        <Input
          id="interests"
          type="text"
          value={formData.interests}
          onChange={(e) => handleInputChange("interests", e.target.value)}
          className="bg-white/10 border-white/20 text-slate-800 placeholder:text-slate-800/50 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-2xl h-12 transition-all duration-300"
          placeholder="sport, muzyka, podróże..."
        />
      </motion.div>

      {/* Register Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full btn-elegant h-12 text-lg font-semibold relative overflow-hidden"
          onClick={(e) => {
            console.log('🎯 Kliknięto przycisk Utwórz konto użytkownika')
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
              Tworzenie konta...
            </motion.div>
          ) : (
            "Utwórz konto użytkownika"
          )}
        </Button>
      </motion.div>

      {/* Login Link */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <p className="text-slate-600">
          Masz już konto?{" "}
          <motion.button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('⬅️ Kliknięto Zaloguj się (UserReg)')
              onSwitchToLogin()
            }}
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors underline underline-offset-2"
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
