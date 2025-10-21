import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Building, User, Eye, EyeSlash, Envelope, Lock } from "@phosphor-icons/react"
import { signIn } from "@/lib/auth"

interface LoginFormProps {
  onLogin: (user: any) => void
  onSwitchToUserRegister: () => void
  onSwitchToBusinessRegister: () => void
}

export function LoginForm({ onLogin, onSwitchToUserRegister, onSwitchToBusinessRegister }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Proszę wypełnić wszystkie pola")
      return
    }

    setIsLoading(true)

    try {
      const user = await signIn(email, password)

      if (user) {
        const successMessage = user.accountType === 'business'
          ? "Witaj w panelu biznesowym!"
          : "Pomyślnie zalogowano!"
        toast.success(successMessage)
        onLogin(user)
      } else {
        toast.error("Nieprawidłowy email lub hasło")
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error("Błąd podczas logowania. Sprawdź swoje dane.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.form 
      onSubmit={handleLogin} 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Email Field */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-12 bg-white/10 border-white/20 text-slate-800 placeholder:text-slate-800/50 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-2xl h-12 transition-all duration-300"
            placeholder="twoj@email.com"
            required
          />
        </div>
      </motion.div>

      {/* Password Field */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

      {/* Login Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full btn-elegant h-12 text-lg font-semibold relative overflow-hidden"
        >
          {isLoading ? (
            <motion.div 
              className="flex items-center gap-3"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Logowanie...
            </motion.div>
          ) : (
            "Zaloguj się"
          )}
        </Button>
      </motion.div>

      {/* Divider */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-black/20 text-slate-600 backdrop-blur-xl rounded-full">
            lub utwórz nowe konto
          </span>
        </div>
      </motion.div>

      {/* Registration Options */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log('🔵 Kliknięto przycisk Użytkownik')
            onSwitchToUserRegister()
          }}
          className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-slate-800 transition-all duration-300 group cursor-pointer"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            whileHover={{ rotate: 10 }}
            className="p-2 rounded-xl bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors"
          >
            <User className="w-5 h-5" />
          </motion.div>
          <div className="text-left">
            <p className="font-semibold">Użytkownik</p>
            <p className="text-sm text-slate-600">Konto osobiste</p>
          </div>
        </motion.button>

        <motion.button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log('🟣 Kliknięto przycisk Biznes')
            onSwitchToBusinessRegister()
          }}
          className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-slate-800 transition-all duration-300 group cursor-pointer"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            whileHover={{ rotate: 10 }}
            className="p-2 rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors"
          >
            <Building className="w-5 h-5" />
          </motion.div>
          <div className="text-left">
            <p className="font-semibold">Biznes</p>
            <p className="text-sm text-slate-600">Konto firmowe</p>
          </div>
        </motion.button>
      </motion.div>
    </motion.form>
  )
}
