import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LoginForm } from "./LoginForm"
import { UserRegistrationForm } from "./UserRegistrationForm"
import { BusinessRegistrationForm } from "./BusinessRegistrationForm"
import tikLogo from "@/assets/images/tik-logo.svg"

type AuthMode = "login" | "register-user" | "register-business"

interface AuthContainerProps {
  onAuthSuccess: (user: any) => void
}

export function AuthContainer({ onAuthSuccess }: AuthContainerProps) {
  const [authMode, setAuthMode] = useState<AuthMode>("login")

  console.log('🎯 AuthContainer render - Current authMode:', authMode)

  const handleLogin = (user: any) => {
    onAuthSuccess(user)
  }

  const handleRegister = (user: any) => {
    onAuthSuccess(user)
  }

  const handleSwitchToUserRegister = () => {
    console.log('🔵 AuthContainer: Przed przełączeniem, authMode:', authMode)
    setAuthMode("register-user")
    console.log('🔵 AuthContainer: Po setAuthMode("register-user")')
  }

  const handleSwitchToBusinessRegister = () => {
    console.log('🟣 AuthContainer: Przed przełączeniem, authMode:', authMode)
    setAuthMode("register-business")
    console.log('🟣 AuthContainer: Po setAuthMode("register-business")')
  }

  const handleBackToLogin = () => {
    console.log('⬅️ AuthContainer: Powrót do logowania')
    setAuthMode("login")
  }

  const renderAuthForm = () => {
    console.log('📋 renderAuthForm wywołane z authMode:', authMode)

    switch (authMode) {
      case "login":
        console.log('✅ Renderowanie LoginForm')
        return (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToUserRegister={handleSwitchToUserRegister}
            onSwitchToBusinessRegister={handleSwitchToBusinessRegister}
          />
        )

      case "register-user":
        console.log('✅ Renderowanie UserRegistrationForm')
        return (
          <UserRegistrationForm
            onRegister={handleLogin}
            onSwitchToLogin={handleBackToLogin}
          />
        )

      case "register-business":
        console.log('✅ Renderowanie BusinessRegistrationForm')
        return (
          <BusinessRegistrationForm
            onRegister={handleLogin}
            onSwitchToLogin={handleBackToLogin}
          />
        )

      default:
        console.log('❌ Nieznany authMode:', authMode)
        return null
    }
  }

  const getAuthTitle = () => {
    switch (authMode) {
      case "login":
        return "Witaj z powrotem!"
      case "register-user":
        return "Dołącz do społeczności"
      case "register-business":
        return "Promuj swoją firmę"
      default:
        return ""
    }
  }

  const getAuthSubtitle = () => {
    switch (authMode) {
      case "login":
        return "Zaloguj się i odkryj lokalne możliwości"
      case "register-user":
        return "Stwórz konto użytkownika premium"
      case "register-business":
        return "Wystartuj z biznesowym dashboardem"
      default:
        return ""
    }
  }

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 auth-grid-bg" />
        </div>

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-sky-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-sky-400/15 to-blue-500/15 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo and Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-xl border border-white/20 mb-6 relative overflow-hidden"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            {/* Glow Effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-sky-500/20 rounded-3xl"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <img 
              src={tikLogo} 
              alt="Tik in de Buurt" 
              className="w-12 h-12 object-contain relative z-10"
            />
          </motion.div>

          <motion.h1 
            className="text-4xl font-bold text-slate-800 mb-2 tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            TIK IN DE BUURT
          </motion.h1>
          <motion.p 
            className="text-slate-600 text-lg font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Premium Local Experience
          </motion.p>
        </motion.div>

        {/* Auth Card */}
        <motion.div 
          className="card-elegant relative"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {/* Premium Border Animation */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-sky-500/10 to-blue-600/10 rounded-3xl opacity-0"
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          {/* Card Header */}
          <motion.div 
            className="text-center mb-8"
            key={authMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {getAuthTitle()}
            </h2>
            <p className="text-slate-600">
              {getAuthSubtitle()}
            </p>
          </motion.div>

          {/* Auth Form */}
          <AnimatePresence mode="wait">
            <motion.div
              key={authMode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              {renderAuthForm()}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="glass-elegant-strong inline-flex items-center gap-2 px-4 py-2 rounded-2xl">
            <motion.div 
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-white/80 text-sm font-medium">
              Szyfrowanie end-to-end
            </span>
          </div>
          <p className="text-white/50 text-xs mt-3">
            Twoje dane są chronione najwyższymi standardami bezpieczeństwa
          </p>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div 
        className="absolute top-10 right-10 w-32 h-32 border border-white/10 rounded-3xl"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute bottom-10 left-10 w-24 h-24 border border-white/10 rounded-2xl"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  )
}