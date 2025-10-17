import { Toaster } from "@/components/ui/sonner"
import { AdminDashboard } from "@/components/AdminDashboard"
import { UserDashboard } from "@/components/UserDashboard"
import { AuthContainer } from "@/components/auth/AuthContainer"
import { LanguageToggle } from "@/components/LanguageToggle"
import { AppProvider, useAuth } from "@/contexts/AppContext"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-elegant-loading"
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Premium Loading Spinner */}
      <motion.div
        className="relative"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="loader-premium"></div>
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              "0 0 20px rgba(102, 126, 234, 0.3)",
              "0 0 40px rgba(102, 126, 234, 0.6), 0 0 60px rgba(118, 75, 162, 0.3)",
              "0 0 20px rgba(102, 126, 234, 0.3)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Loading Text */}
      <motion.div
        className="absolute mt-32 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-premium text-2xl font-bold tracking-wide">
          TIK IN DE BUURT
        </h2>
        <p className="text-white/60 mt-2 font-light">
          Loading premium experience...
        </p>
      </motion.div>
    </motion.div>
  )
}

function AppContent() {
  const { currentUser, isAuthenticated, logout, setCurrentUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for premium experience
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleAuthSuccess = (user: any) => {
    setCurrentUser(user)
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  // If no user is logged in, show auth
  if (!isAuthenticated || !currentUser) {
    return (
      <motion.div 
        className="min-h-screen relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-elegant-auth" />
          
          {/* Floating Orbs */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full opacity-20 orb-elegant-${i + 1} animate-elegant-float`}
              style={{
                width: `${300 + i * 100}px`,
                height: `${300 + i * 100}px`,
                left: `${10 + i * 30}%`,
                top: `${10 + i * 20}%`,
              }}
              animate={{
                x: [0, 50, 0],
                y: [0, -30, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 15 + i * 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Language Toggle */}
        <motion.div 
          className="fixed top-6 right-6 z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="glass p-2 rounded-2xl">
            <LanguageToggle />
          </div>
        </motion.div>

        {/* Auth Container */}
        <div className="relative z-10">
          <AuthContainer onAuthSuccess={handleAuthSuccess} />
        </div>

        <Toaster position="top-center" />
      </motion.div>
    )
  }

  const handleLogout = async () => {
    await logout()
  }

  // Show appropriate dashboard based on account type
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="min-h-screen relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Dashboard Background */}
        <div className="absolute inset-0 z-0 bg-elegant-dashboard" />
        
        {/* Content */}
        <div className="relative z-10">
          {currentUser.accountType === "business" ? (
            <AdminDashboard currentUser={currentUser} onLogout={handleLogout} />
          ) : (
            <UserDashboard user={currentUser} onLogout={handleLogout} />
          )}
        </div>
        
        <Toaster position="top-center" />
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  return (
    <AppProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <AppContent />
      </motion.div>
    </AppProvider>
  )
}

export default App