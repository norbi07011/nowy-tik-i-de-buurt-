import { useState } from "react"
import { useKV } from "@/hooks/use-local-storage"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ChartBarIcon, 
  BuildingStorefrontIcon, 
  ChatBubbleLeftRightIcon, 
  MegaphoneIcon, 
  CogIcon,
  BellIcon,
  DocumentTextIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  HandRaisedIcon,
  WrenchScrewdriverIcon,
  Bars3Icon,
  XMarkIcon,
  PlayIcon,
  PhotoIcon,
  TagIcon,
  HomeIcon,
  SparklesIcon
} from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { LanguageToggle } from "@/components/LanguageToggle"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/use-translation"
import { DashboardPanel } from "@/components/DashboardPanel"
import { MyBusinessView } from "@/components/MyBusinessView"
import { ChatMessagesView } from "@/components/ChatMessagesView"
import { MoviesView } from "@/components/MoviesView"
import { PhotosView } from "@/components/PhotosView"
import { DiscountsView } from "@/components/DiscountsView"
import { RealEstateView } from "@/components/RealEstateView"
import { WorkersView } from "@/components/WorkersView"
import { ProfileView } from "@/components/ProfileView"
import { NotificationsView } from "@/components/NotificationsView"
import { SettingsView } from "@/components/SettingsView"
import { AccountView } from "@/components/AccountView"
import { MarketingServicesView } from "@/components/MarketingServicesView"
import { SupportView } from "@/components/SupportView"
import { PaymentsPanel } from "@/components/business/PaymentsPanel"
import { CustomerEngagement } from "@/components/business/CustomerEngagement"
const tikLogo = "/Zdjęcie WhatsApp 2025-10-15 o 02.37.04_f6d57835.jpg"

type SidebarItem = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  active?: boolean
}

type TopNavItem = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface AdminDashboardProps {
  currentUser: any
  onLogout: () => void
}

export function AdminDashboard({ currentUser, onLogout }: AdminDashboardProps) {
  const [activeView, setActiveView] = useKV("admin-active-view", "business")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { t } = useTranslation()

  const topNavItems: TopNavItem[] = [
    { id: "movies", label: t("movies"), icon: PlayIcon },
    { id: "photos", label: t("photos"), icon: PhotoIcon },
    { id: "discounts", label: t("discounts") + " -35%", icon: TagIcon },
    { id: "real-estate", label: t("realEstate"), icon: HomeIcon },
    { id: "workers", label: t("workers"), icon: UserIcon },
    { id: "marketing", label: t("marketing"), icon: MegaphoneIcon },
    { id: "payments", label: t("payments"), icon: CogIcon },
    { id: "customers", label: t("customers"), icon: ChatBubbleLeftRightIcon }
  ]

  const sidebarItems: SidebarItem[] = [
    { id: "business", label: t("myBusiness"), icon: BuildingStorefrontIcon },
    { id: "chat", label: t("messages"), icon: ChatBubbleLeftRightIcon, badge: "3" }
  ]

  const bottomSidebarItems: SidebarItem[] = [
    { id: "profile", label: t("profile"), icon: UserIcon },
    { id: "notifications", label: t("notifications"), icon: BellIcon },
    { id: "saved", label: t("saved"), icon: DocumentTextIcon },
    { id: "settings", label: t("settings"), icon: CogIcon },
    { id: "account", label: t("account"), icon: UserIcon },
    { id: "support", label: t("support"), icon: HandRaisedIcon },
    { id: "logout", label: t("logout"), icon: ArrowRightOnRectangleIcon }
  ]

  const renderActiveView = () => {
    switch (activeView) {
      case "business":
        return <MyBusinessView />
      case "chat":
        return <ChatMessagesView />
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
      case "marketing":
        return <MarketingServicesView />
      case "payments":
        return <PaymentsPanel businessId={currentUser.id} />
      case "customers":
        return <CustomerEngagement businessId={currentUser.id} />
      case "profile":
        return <ProfileView />
      case "notifications":
        return <NotificationsView />
      case "settings":
        return <SettingsView />
      case "account":
        return <AccountView />
      case "support":
        return <SupportView />
      case "logout":
        return <div className="p-8 text-center"><p>{t("loading")}</p></div>
      default:
        return <MyBusinessView />
    }
  }

  const SidebarContent = () => (
    <motion.div 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="flex h-full flex-col glass-effect backdrop-blur-xl border-r border-white/20 bg-gradient-to-b from-white/95 to-white/80"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden shadow-glow">
            <img 
              src={tikLogo} 
              alt="Tik in de Buurt" 
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              TIK in de buurt
            </h1>
            <p className="text-xs text-muted-foreground">Zakelijke Dashboard</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        <div className="space-y-2">
          {/* Online indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground bg-green-50 rounded-xl"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">{t("online")}</span>
          </motion.div>

          {/* Mobile top navigation */}
          <div className="lg:hidden space-y-1 mb-6">
            <div className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {t("browse")}
            </div>
            {topNavItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start gap-3 px-4 py-3 h-auto text-sm font-medium rounded-xl hover-lift",
                    activeView === item.id 
                      ? "bg-gradient-to-r from-primary/10 to-accent/10 text-primary border border-primary/20 shadow-glow" 
                      : "text-gray-700 hover:bg-white/60"
                  )}
                  onClick={() => {
                    setActiveView(item.id)
                    setSidebarOpen(false)
                  }}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                </Button>
              </motion.div>
            ))}
            <Separator className="my-4 bg-white/30" />
          </div>

          {/* Main navigation - management */}
          <div className="space-y-1">
            <div className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {t("management")}
            </div>
            {sidebarItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * (index + 3) }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start gap-3 px-4 py-3 h-auto text-sm font-medium rounded-xl hover-lift",
                    activeView === item.id 
                      ? "bg-gradient-to-r from-primary/10 to-accent/10 text-primary border border-primary/20 shadow-glow" 
                      : "text-gray-700 hover:bg-white/60"
                  )}
                  onClick={() => {
                    setActiveView(item.id)
                    setSidebarOpen(false)
                  }}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge className="bg-gradient-accent text-white text-xs px-2 py-1 min-w-0 h-6 animate-pulse">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-white/20 p-4">
        <div className="space-y-1">
          {bottomSidebarItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-3 px-4 py-2 h-auto text-sm font-normal text-gray-600 hover:bg-white/60 rounded-xl"
                onClick={() => {
                  if (item.id === "logout") {
                    onLogout()
                  } else {
                    setActiveView(item.id)
                    setSidebarOpen(false)
                  }
                }}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 transform transition-all duration-300 ease-out lg:relative lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-effect backdrop-blur-xl border-b border-white/20 px-6 py-4 flex items-center justify-between bg-gradient-to-r from-white/95 to-white/90"
        >
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2 rounded-xl hover:bg-white/60"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="w-6 h-6" />
          </Button>

          {/* Top navigation - content browsing */}
          <nav className="hidden lg:flex items-center gap-2">
            {topNavItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Button
                  variant={activeView === item.id ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "gap-2 px-4 py-2 h-10 rounded-xl font-medium transition-all duration-200",
                    activeView === item.id 
                      ? "gradient-primary text-white shadow-glow scale-105" 
                      : "text-gray-600 hover:text-primary hover:bg-white/80 hover-lift"
                  )}
                  onClick={() => setActiveView(item.id)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              </motion.div>
            ))}
          </nav>

          {/* Profile section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <LanguageToggle />
            <div className="w-10 h-10 gradient-accent rounded-2xl flex items-center justify-center animate-float">
              <div className="w-5 h-5 bg-white rounded-full"></div>
            </div>
            <Button variant="ghost" size="sm" className="hidden lg:flex p-2 rounded-xl hover:bg-white/60">
              <UserIcon className="w-5 h-5" />
            </Button>
          </motion.div>
        </motion.header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            {renderActiveView()}
          </motion.div>
        </main>
      </div>
    </div>
  )
}