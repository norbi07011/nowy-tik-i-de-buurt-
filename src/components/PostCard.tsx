import { Star, ChatCircle, Bookmark, ShareNetwork, MapPin, CheckCircle, EnvelopeSimple, WhatsappLogo, User } from "@phosphor-icons/react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BusinessPost } from "@/types/business"
import { cn } from "@/lib/utils"

interface PostCardProps {
  post: BusinessPost
  onLike: (postId: string) => void
  onSave: (postId: string) => void
  onComment: (postId: string) => void
  onShare: (postId: string) => void
  onViewProfile?: (businessId: string) => void
  onMessage?: (businessId: string) => void
}

export function PostCard({ post, onLike, onSave, onComment, onShare, onViewProfile, onMessage }: PostCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isInteracting, setIsInteracting] = useState(false)

  // Safety check for post object
  if (!post) {
    return null
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
  }

  const handleInteraction = (action: () => void) => {
    setIsInteracting(true)
    action()
    setTimeout(() => setIsInteracting(false), 300)
  }

  const handleContactBusiness = (type: 'profile' | 'message' | 'email' | 'whatsapp') => {
    switch (type) {
      case 'profile':
        onViewProfile?.(post.id)
        break
      case 'message':
        onMessage?.(post.id)
        break
      case 'email':
        window.open(`mailto:info@${post.businessName.toLowerCase().replace(/\s+/g, '')}.nl`)
        break
      case 'whatsapp':
        window.open(`https://wa.me/31612345678?text=Hallo%20${encodeURIComponent(post.businessName)},%20ik%20heb%20interesse%20in%20jullie%20aanbod!`)
        break
    }
  }

  return (
    <Card className="feed-item relative w-full h-screen bg-gradient-to-br from-background to-secondary/20 overflow-hidden border-0 rounded-none">
      <div className="absolute inset-0">
        <motion.img
          src={post.imageUrl || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=800&fit=crop"}
          alt={post.title || "Business post"}
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          )}
          onLoad={() => setImageLoaded(true)}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />
      </div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/60 to-transparent"
      >
        <div className="flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Avatar className="w-12 h-12 border-2 border-white/30 shadow-lg">
              <AvatarImage src={post.businessAvatar} alt={post.businessName || "Business"} />
              <AvatarFallback className="gradient-primary text-white font-bold">
                {(post.businessName || "UN").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-bold text-lg">{post.businessName || "Onbekende bedrijf"}</h3>
              {post.isVerified && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <CheckCircle size={18} className="text-accent" weight="fill" />
                </motion.div>
              )}
            </div>
            <div className="flex items-center gap-3 text-white/90 text-sm">
              <Badge className="gradient-accent text-white text-xs px-3 py-1 rounded-full font-medium">
                {post.businessCategory || "Algemeen"}
              </Badge>
              <span>•</span>
              <span className="font-medium">{post.timestamp || "Recent"}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent"
      >
        <div className="flex items-end gap-6">
          <div className="flex-1 space-y-4">
            <div className="space-y-3">
              <motion.p 
                className="text-white font-medium text-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {post.description || "Geen beschrijving beschikbaar"}
              </motion.p>
              <motion.div 
                className="flex items-center gap-2 text-white/90 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <MapPin size={16} weight="fill" className="text-accent" />
                <span className="font-medium">{post.location || "Locatie onbekend"}</span>
              </motion.div>
            </div>

            {/* Quick contact buttons */}
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                size="sm"
                onClick={() => handleContactBusiness('profile')}
                className="bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 rounded-xl px-4 py-2 h-10"
              >
                <User size={16} className="mr-2" />
                Profiel
              </Button>
              <Button
                size="sm"
                onClick={() => handleContactBusiness('message')}
                className="bg-primary/20 backdrop-blur-lg border border-primary/30 text-white hover:bg-primary/30 rounded-xl px-4 py-2 h-10"
              >
                <ChatCircle size={16} className="mr-2" />
                Bericht
              </Button>
              <Button
                size="sm"
                onClick={() => handleContactBusiness('email')}
                className="bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 rounded-xl p-2 h-10 w-10"
              >
                <EnvelopeSimple size={16} />
              </Button>
              <Button
                size="sm"
                onClick={() => handleContactBusiness('whatsapp')}
                className="bg-green-500/20 backdrop-blur-lg border border-green-500/30 text-white hover:bg-green-500/30 rounded-xl p-2 h-10 w-10"
              >
                <WhatsappLogo size={16} />
              </Button>
            </motion.div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-14 h-14 rounded-2xl glass-effect backdrop-blur-lg hover:bg-white/20 flex flex-col items-center justify-center gap-1 border border-white/20 shadow-lg",
                  post.isLiked && "bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-500/30"
                )}
                onClick={() => handleInteraction(() => onLike(post.id))}
              >
                <motion.div
                  animate={post.isLiked ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Star 
                    size={22} 
                    weight={post.isLiked ? "fill" : "regular"}
                    className={cn("transition-colors", post.isLiked ? "text-yellow-500" : "text-white")}
                  />
                </motion.div>
                <span className="text-xs text-white font-bold">
                  {formatNumber(post.likes || 0)}
                </span>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="w-14 h-14 rounded-2xl glass-effect backdrop-blur-lg hover:bg-white/20 flex flex-col items-center justify-center gap-1 border border-white/20 shadow-lg"
                onClick={() => handleInteraction(() => onComment(post.id))}
              >
                <ChatCircle size={22} className="text-white" />
                <span className="text-xs text-white font-bold">
                  {formatNumber(post.comments || 0)}
                </span>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-14 h-14 rounded-2xl glass-effect backdrop-blur-lg hover:bg-white/20 flex flex-col items-center justify-center gap-1 border border-white/20 shadow-lg",
                  post.isSaved && "bg-accent/20 hover:bg-accent/30 border-accent/30"
                )}
                onClick={() => handleInteraction(() => onSave(post.id))}
              >
                <motion.div
                  animate={post.isSaved ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Bookmark 
                    size={22} 
                    weight={post.isSaved ? "fill" : "regular"}
                    className={cn("transition-colors", post.isSaved ? "text-accent" : "text-white")}
                  />
                </motion.div>
                <span className="text-xs text-white font-bold">
                  {formatNumber(post.saves || 0)}
                </span>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="w-14 h-14 rounded-2xl glass-effect backdrop-blur-lg hover:bg-white/20 flex items-center justify-center border border-white/20 shadow-lg"
                onClick={() => handleInteraction(() => onShare(post.id))}
              >
                <ShareNetwork size={22} className="text-white" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Loading state */}
      <AnimatePresence>
        {!imageLoaded && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-muted to-secondary/20 flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 gradient-primary rounded-full p-1"
            >
              <div className="w-full h-full bg-background rounded-full" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}