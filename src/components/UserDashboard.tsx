import { useState } from "react"
import { useKV } from "@github/spark/hooks"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { LanguageToggle } from "@/components/LanguageToggle"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/use-translation"
import { 
  Bookmark, 
  ChatCircle, 
  User, 
  Gear, 
  Bell,
  MagnifyingGlass,
  MapPin,
  SignOut,
  List,
  X,
  Play,
  Camera,
  Tag,
  House,
  Sparkle
} from "@phosphor-icons/react"
import { Feed } from "./Feed2026"
import { ModernProfileView } from "./ModernProfileView"
import { UserSettingsView } from "./UserSettingsView"
import { UserNotificationsView } from "./UserNotificationsView"
import { ChatMessagesView } from "./ChatMessagesView"
import { MoviesView } from "./MoviesView"
import { PhotosView } from "./PhotosView"
import { DiscountsView } from "./DiscountsView"
import { RealEstateView } from "./RealEstateView"
import { WorkersView } from "./WorkersView"
import { SearchView } from "./SearchView"
import { UserSavedView } from "./UserSavedView"
import tikLogo from "@/assets/images/tik-logo.svg"

type SidebarItem = {
  id: string
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  badge?: string
}

type TopNavItem = {
  id: string
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

interface UserDashboardProps {
  user: any
  onLogout: () => void
}

export function UserDashboard({ user, onLogout }: UserDashboardProps) {
  const [activeView, setActiveView] = useKV("user-active-view", "feed")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { t } = useTranslation()

  const topNavItems: TopNavItem[] = [
    { id: "movies", label: t("movies"), icon: Play },
    { id: "photos", label: t("photos"), icon: Camera },
    { id: "discounts", label: t("discounts"), icon: Tag },
    { id: "real-estate", label: t("realEstate"), icon: House },
    { id: "workers", label: t("workers"), icon: User },
    { id: "search", label: t("search"), icon: MagnifyingGlass }
  ]

  const sidebarItems: SidebarItem[] = [
    { id: "feed", label: t("hoofdpagina"), icon: House },
    { id: "saved", label: "Opgeslagen", icon: Bookmark },
    { id: "messages", label: t("berichten"), icon: ChatCircle, badge: "2" }
  ]

  const bottomSidebarItems: SidebarItem[] = [
    { id: "profile", label: t("profil"), icon: User },
    { id: "notifications", label: t("notificaties"), icon: Bell },
    { id: "settings", label: t("instellingen"), icon: Gear },
    { id: "logout", label: t("logout"), icon: SignOut }
  ]

  const handleLogout = () => {
    onLogout()
  }

  const renderActiveView = () => {
    switch (activeView) {
      case "feed":
        return <Feed />
      case "movies":
        return <MoviesView />
      case "photos":
        return <PhotosView />
      case "discounts":
        return <DiscountsView />
      case "real-estate":
        return <RealEstateView />
      case "workers":
        return <WorkersView />
      case "search":
        return <SearchView />
      case "saved":
        return <UserSavedView user={user} />
      case "messages":
        return <ChatMessagesView />
      case "profile":
        return <ModernProfileView user={user} onLogout={handleLogout} />
      case "settings":
        return <UserSettingsView user={user} />
      case "notifications":
        return <UserNotificationsView user={user} />
      case "logout":
        handleLogout()
        return <div className="p-8 text-center"><p>{t("loading")}</p></div>
      default:
        return <Feed />
    }
  }

  const SidebarContent = () => (
    <motion.div 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex h-full flex-col glass relative overflow-hidden"
    >
      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-purple-500/10 pointer-events-none" />
      
      {/* Animated Border */}
      <div className="absolute inset-0 border border-white/20 rounded-r-3xl pointer-events-none" />
      
      {/* Header */}
      <motion.div 
        className="p-6 border-b border-white/20 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-4">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-2xl animate-pulse" />
              <img 
                src={tikLogo} 
                alt="Tik in de Buurt" 
                className="w-full h-full object-contain relative z-10"
              />
            </div>
          </motion.div>
          <div>
            <motion.h1 
              className="font-bold text-xl text-premium tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              TIK IN DE BUURT
            </motion.h1>
            <motion.p 
              className="text-sm text-white/70 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Premium Experience
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* User Profile Section */}
      <motion.div 
        className="p-6 border-b border-white/20 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <Avatar className="h-14 w-14 ring-2 ring-white/30 ring-offset-2 ring-offset-transparent">
              <AvatarImage src={user?.profileImage} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <div className="flex-1 min-w-0">
            <motion.h3 
              className="font-semibold text-white truncate text-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {user?.name || user?.email || 'User'}
            </motion.h3>
            <motion.div 
              className="flex items-center gap-2 mt-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Badge variant="secondary" className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-300 text-xs">
                <Sparkle className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div 
        className="flex-1 p-4 space-y-2 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {sidebarItems.map((item, index) => (
          <motion.button
            key={item.id}
            onClick={() => {
              setActiveView(item.id)
              setSidebarOpen(false)
            }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-300 group relative overflow-hidden",
              activeView === item.id
                ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white border border-white/30"
                : "hover:bg-white/10 text-white/80 hover:text-white border border-transparent hover:border-white/20"
            )}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            whileHover={{ x: 5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Hover Effect Background */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              layoutId={`sidebar-hover-${item.id}`}
            />
            
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <item.icon className="w-5 h-5 relative z-10" />
            </motion.div>
            <span className="font-medium relative z-10">{item.label}</span>
            {item.badge && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold relative z-10"
              >
                {item.badge}
              </motion.div>
            )}
            
            {/* Active Indicator */}
            {activeView === item.id && (
              <motion.div
                className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r"
                layoutId="sidebar-active"
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Bottom Navigation */}
      <motion.div 
        className="p-4 border-t border-white/20 space-y-2 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {bottomSidebarItems.map((item, index) => (
          <motion.button
            key={item.id}
            onClick={() => {
              setActiveView(item.id)
              setSidebarOpen(false)
            }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-300 group relative overflow-hidden",
              activeView === item.id
                ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white border border-white/30"
                : "hover:bg-white/10 text-white/80 hover:text-white border border-transparent hover:border-white/20"
            )}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            whileHover={{ x: 5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              whileHover={{ rotate: item.id === 'logout' ? 180 : 10, scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <item.icon className="w-5 h-5" />
            </motion.div>
            <span className="font-medium">{item.label}</span>
            
            {activeView === item.id && (
              <motion.div
                className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r"
                layoutId="sidebar-bottom-active"
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  )

  return (
    <motion.div 
      className="flex h-screen relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-10"
            animate={{
              x: [0, Math.random() * 50 - 25],
              y: [0, Math.random() * 50 - 25],
              opacity: [0.1, 0.3, 0.1],
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
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-80 z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.div 
        className="hidden lg:flex w-80 h-full relative z-10"
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <SidebarContent />
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="flex-1 flex flex-col relative z-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Top Navigation */}
        <motion.div 
          className="glass border-b border-white/20 p-4 relative"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Mobile Header */}
          <div className="flex lg:hidden items-center justify-between mb-4">
            <motion.button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <List className="w-6 h-6 text-white" />
            </motion.button>
            <LanguageToggle />
          </div>

          {/* Top Navigation Items */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {topNavItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 relative overflow-hidden group",
                  activeView === item.id
                    ? "bg-gradient-to-r from-blue-500/30 to-purple-600/30 text-white border border-white/40"
                    : "bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/20 hover:border-white/40"
                )}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                  animate={{ left: activeView === item.id ? ["-100%", "100%"] : "-100%" }}
                  transition={{ duration: 1, repeat: activeView === item.id ? Infinity : 0, repeatDelay: 3 }}
                />
                
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <item.icon className="w-5 h-5 relative z-10" />
                </motion.div>
                <span className="font-medium relative z-10">{item.label}</span>
                
                {/* Active Indicator */}
                {activeView === item.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"
                    layoutId="top-nav-active"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content Area */}
        <motion.div 
          className="flex-1 overflow-y-auto relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}