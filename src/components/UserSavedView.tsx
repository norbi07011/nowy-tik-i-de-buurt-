import { useState, useEffect, useCallback } from "react"
import { useKV } from "@/hooks/use-local-storage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Heart, 
  ChatCircle, 
  Share, 
  Bookmark, 
  MapPin, 
  Buildings,
  Star,
  Eye,
  SignOut,
  Gear,
  Trash,
  ArrowRight
} from "@phosphor-icons/react"
import { PostCard } from "./PostCard"
import { generateMockPosts } from "@/lib/mockData"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/use-translation"

interface UserSavedViewProps {
  user: any
}

interface QuickAction {
  id: string
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  count: number
  color: string
  onClick: () => void
}

export function UserSavedView({ user }: UserSavedViewProps) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("overview")
  
  // All data hooks
  const [savedPosts, setSavedPosts] = useKV<string[]>("saved-posts", [])
  const [likedPosts, setLikedPosts] = useKV<string[]>("liked-posts", [])
  const [followedBusinesses, setFollowedBusinesses] = useKV<string[]>("followed-businesses", [])
  const [userSettings, setUserSettings] = useKV<any>("user-settings", {})
  const [watchedItems, setWatchedItems] = useKV<string[]>("watched-items", [])
  
  // Mock data for posts
  const [allPosts, setAllPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const mockPosts = generateMockPosts(30)
    setAllPosts(mockPosts)
    setLoading(false)
  }, [])

  // Get filtered data
  const savedPostsData = allPosts.filter(post => (savedPosts || []).includes(post.id))
  const likedPostsData = allPosts.filter(post => (likedPosts || []).includes(post.id))
  const followedBusinessesData = allPosts
    .filter(post => (followedBusinesses || []).includes(post.businessId))
    .reduce((acc, post) => {
      if (!acc.find(item => item.businessId === post.businessId)) {
        acc.push({
          id: post.businessId,
          businessId: post.businessId,
          businessName: post.businessName,
          businessCategory: post.businessCategory,
          businessImage: post.businessImage,
          location: post.location,
          rating: Math.random() * 2 + 3, // 3-5 star rating
          isFollowed: true
        })
      }
      return acc
    }, [] as any[])

  const quickActions: QuickAction[] = [
    {
      id: "saved",
      label: "Zapisane posty",
      icon: Bookmark,
      count: (savedPosts || []).length,
      color: "text-blue-600 bg-blue-50",
      onClick: () => setActiveTab("saved")
    },
    {
      id: "liked",
      label: "Polubione",
      icon: Heart,
      count: (likedPosts || []).length,
      color: "text-pink-600 bg-pink-50",
      onClick: () => setActiveTab("liked")
    },
    {
      id: "followed",
      label: "Obserwowane firmy",
      icon: Buildings,
      count: (followedBusinesses || []).length,
      color: "text-orange-600 bg-orange-50",
      onClick: () => setActiveTab("followed")
    },
    {
      id: "settings",
      label: "Ustawienia",
      icon: Gear,
      count: 0,
      color: "text-gray-600 bg-gray-50",
      onClick: () => setActiveTab("settings")
    }
  ]

  const handleLike = useCallback((postId: string) => {
    setLikedPosts(current => {
      const currentArray = Array.isArray(current) ? current : []
      return currentArray.includes(postId)
        ? currentArray.filter(id => id !== postId)
        : [...currentArray, postId]
    })
    toast.success("Post updated!")
  }, [setLikedPosts])

  const handleSave = useCallback((postId: string) => {
    setSavedPosts(current => {
      const currentArray = Array.isArray(current) ? current : []
      return currentArray.includes(postId)
        ? currentArray.filter(id => id !== postId)
        : [...currentArray, postId]
    })
    toast.success("Post updated!")
  }, [setSavedPosts])

  const handleFollow = useCallback((businessId: string) => {
    setFollowedBusinesses(current => {
      const currentArray = Array.isArray(current) ? current : []
      const isFollowing = currentArray.includes(businessId)
      toast.success(isFollowing ? "Przestano obserwować firmę" : "Obserwujesz firmę")
      return isFollowing
        ? currentArray.filter(id => id !== businessId)
        : [...currentArray, businessId]
    })
  }, [setFollowedBusinesses])

  const handleComment = useCallback((postId: string) => {
    toast.info("Opening comments...")
  }, [])

  const handleShare = useCallback((postId: string) => {
    if (navigator.share) {
      navigator.share({
        title: "Check out this local business",
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-2xl" />
          <div className="relative bg-gradient-to-br from-background to-muted p-8 rounded-3xl border border-border/50">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              Opgeslagen
            </h1>
            <p className="text-muted-foreground">
              Zarządzaj swoimi zapisanymi elementami i preferencjami
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="text-accent" />
              Szybkie akcje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="ghost"
                    className="h-auto p-4 w-full flex-col items-start hover-lift"
                    onClick={action.onClick}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className={cn("p-2 rounded-lg", action.color)}>
                        <action.icon size={20} />
                      </div>
                      {action.count > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {action.count}
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm font-medium text-left w-full">{action.label}</span>
                    <ArrowRight size={14} className="text-muted-foreground mt-1 self-end" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="card-modern">
          <CardHeader>
            <CardTitle>Informacje o koncie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className="gradient-accent text-white">
                  Niezweryfikowany
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Typ konta</p>
                <p className="font-medium">Osobiste</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Język</p>
                <p className="font-medium">English</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Views */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Przegląd</TabsTrigger>
            <TabsTrigger value="saved">Zapisane ({(savedPosts || []).length})</TabsTrigger>
            <TabsTrigger value="liked">Polubione ({(likedPosts || []).length})</TabsTrigger>
            <TabsTrigger value="followed">Firmy ({(followedBusinesses || []).length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6">
              <Card className="card-modern">
                <CardHeader>
                  <CardTitle>Ostatnia aktywność</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Heart className="text-pink-500" size={16} />
                      <span className="text-sm">Polubiłeś post od <strong>Cafe Corner</strong></span>
                      <span className="text-xs text-muted-foreground ml-auto">2 godz. temu</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Bookmark className="text-blue-500" size={16} />
                      <span className="text-sm">Zapisałeś post od <strong>Green Garden</strong></span>
                      <span className="text-xs text-muted-foreground ml-auto">5 godz. temu</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Buildings className="text-orange-500" size={16} />
                      <span className="text-sm">Zacząłeś obserwować <strong>Tech Repair Shop</strong></span>
                      <span className="text-xs text-muted-foreground ml-auto">1 dzień temu</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            <AnimatePresence mode="wait">
              {savedPostsData.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="text-center py-12">
                    <CardContent>
                      <Bookmark size={64} className="mx-auto text-muted-foreground mb-4" />
                      <CardTitle className="mb-2">Brak zapisanych postów</CardTitle>
                      <CardDescription>
                        Gdy znajdziesz interesujące oferty, zapisz je klikając ikonę zakładki
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid gap-6"
                >
                  {savedPostsData.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <PostCard
                        post={{
                          ...post,
                          isLiked: (likedPosts || []).includes(post.id),
                          isSaved: true
                        }}
                        onLike={handleLike}
                        onSave={handleSave}
                        onComment={handleComment}
                        onShare={handleShare}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="liked" className="mt-6">
            <AnimatePresence mode="wait">
              {likedPostsData.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="text-center py-12">
                    <CardContent>
                      <Heart size={64} className="mx-auto text-muted-foreground mb-4" />
                      <CardTitle className="mb-2">Brak polubionych postów</CardTitle>
                      <CardDescription>
                        Gdy znajdziesz interesujące oferty, polub je klikając ikonę serca
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid gap-6"
                >
                  {likedPostsData.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <PostCard
                        post={{
                          ...post,
                          isLiked: true,
                          isSaved: (savedPosts || []).includes(post.id)
                        }}
                        onLike={handleLike}
                        onSave={handleSave}
                        onComment={handleComment}
                        onShare={handleShare}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="followed" className="mt-6">
            <AnimatePresence mode="wait">
              {followedBusinessesData.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="text-center py-12">
                    <CardContent>
                      <Buildings size={64} className="mx-auto text-muted-foreground mb-4" />
                      <CardTitle className="mb-2">Brak obserwowanych firm</CardTitle>
                      <CardDescription>
                        Zacznij obserwować lokalne firmy, aby być na bieżąco z ich ofertami
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid gap-4"
                >
                  {followedBusinessesData.map((business, index) => (
                    <motion.div
                      key={business.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Card className="card-modern hover-lift">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                                {business.businessName.charAt(0)}
                              </div>
                              <div>
                                <h3 className="font-semibold">{business.businessName}</h3>
                                <p className="text-sm text-muted-foreground">{business.businessCategory}</p>
                                <div className="flex items-center gap-1 mt-1">
                                  <MapPin size={12} className="text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">{business.location}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <Star size={14} className="text-yellow-500 fill-current" />
                                <span className="text-sm font-medium">{business.rating.toFixed(1)}</span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleFollow(business.businessId)}
                                className="text-xs"
                              >
                                <Eye size={14} className="mr-1" />
                                Obserwujesz
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Logout Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center pt-8"
      >
        <Button
          variant="destructive"
          className="gap-2"
          onClick={() => {
            toast.success("Wylogowano pomyślnie")
            // Handle logout logic here
          }}
        >
          <SignOut size={16} />
          Wyloguj się
        </Button>
      </motion.div>
    </div>
  )
}