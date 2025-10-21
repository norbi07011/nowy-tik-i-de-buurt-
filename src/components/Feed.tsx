import { useEffect, useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PostCard } from "@/components/PostCard"
import { BusinessPost } from "@/types/business"
import { supabaseApi, Post as SupabasePost } from "@/lib/supabaseApi"
import { toast } from "sonner"

const LoadingSpinner = () => (
  <div className="h-screen w-full bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center">
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-6"
    >
      <div className="relative">
        <motion.div 
          className="w-16 h-16 gradient-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute inset-2 bg-background rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <p className="text-foreground text-lg font-medium">Ładowanie...</p>
        <p className="text-muted-foreground text-sm">Odkrywamy lokalne firmy dla Ciebie</p>
      </motion.div>
    </motion.div>
  </div>
)

export function Feed() {
  const [posts, setPosts] = useState<BusinessPost[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const feedRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const convertSupabasePostToBusinessPost = (post: SupabasePost): BusinessPost => {
    const profile = post.profiles
    const businessProfile = post.business_profiles
    const media = post.post_media?.[0]

    return {
      id: post.id,
      businessId: post.business_id || post.user_id,
      businessName: businessProfile?.business_name || profile?.name || 'Unknown',
      businessCategory: businessProfile?.category || 'General',
      businessAvatar: businessProfile?.logo_image || profile?.profile_image || '',
      title: post.title || '',
      description: post.content,
      imageUrl: media?.url || '',
      location: post.location || post.city || '',
      timestamp: new Date(post.created_at).toLocaleDateString('nl-NL'),
      likes: post.likes_count,
      comments: post.comments_count,
      saves: post.saves_count,
      views: post.views_count,
      isLiked: false,
      isSaved: false,
      isVerified: businessProfile?.is_verified || false,
      tags: post.tags || []
    }
  }

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true)
      try {
        const supabasePosts = await supabaseApi.getPosts(20, 0)
        const convertedPosts = supabasePosts.map(convertSupabasePostToBusinessPost)
        setPosts(convertedPosts)
      } catch (error) {
        console.error('Error loading posts:', error)
        toast.error('Błąd podczas ładowania postów')
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  const updateCurrentIndex = useCallback(() => {
    if (!feedRef.current) return
    
    const scrollTop = feedRef.current.scrollTop
    const itemHeight = feedRef.current.clientHeight
    const newIndex = Math.round(scrollTop / itemHeight)
    
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < posts.length) {
      setCurrentIndex(newIndex)
    }
  }, [currentIndex, posts.length])

  useEffect(() => {
    const feedElement = feedRef.current
    if (!feedElement) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0')
            setCurrentIndex(index)
          }
        })
      },
      { threshold: 0.7 }
    )

    const postElements = feedElement.querySelectorAll('.feed-item')
    postElements.forEach((element) => {
      observerRef.current?.observe(element)
    })

    return () => {
      observerRef.current?.disconnect()
    }
  }, [posts])

  const handleLike = useCallback(async (postId: string) => {
    const post = posts.find(p => p.id === postId)
    if (!post) return

    const newIsLiked = !post.isLiked

    setPosts(current =>
      current.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            isLiked: newIsLiked,
            likes: newIsLiked ? p.likes + 1 : p.likes - 1
          }
        }
        return p
      })
    )

    const result = await supabaseApi.likePost(postId)
    if (result !== newIsLiked) {
      setPosts(current =>
        current.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              isLiked: result,
              likes: result ? p.likes + 1 : p.likes - 1
            }
          }
          return p
        })
      )
    }
  }, [posts])

  const handleSave = useCallback(async (postId: string) => {
    const post = posts.find(p => p.id === postId)
    if (!post) return

    const newIsSaved = !post.isSaved

    setPosts(current =>
      current.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            isSaved: newIsSaved,
            saves: newIsSaved ? p.saves + 1 : p.saves - 1
          }
        }
        return p
      })
    )

    const result = await supabaseApi.savePost(postId)
    if (result !== newIsSaved) {
      setPosts(current =>
        current.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              isSaved: result,
              saves: result ? p.saves + 1 : p.saves - 1
            }
          }
          return p
        })
      )
    }
  }, [posts])

  const handleComment = useCallback((postId: string) => {
    const post = posts.find(p => p.id === postId)
    if (post) {
      toast.info(`Otwieranie komentarzy dla ${post.businessName}`)
    }
  }, [posts])

  const handleShare = useCallback((postId: string) => {
    const post = posts.find(p => p.id === postId)
    if (post) {
      if (navigator.share) {
        navigator.share({
          title: post.title,
          text: post.description,
          url: window.location.href
        })
      } else {
        navigator.clipboard.writeText(window.location.href)
        toast.success("Link skopiowany!", {
          description: "Link został skopiowany do schowka"
        })
      }
    }
  }, [posts])

  const handleViewProfile = useCallback((businessId: string) => {
    // Handle business profile view
    console.log("View profile for business:", businessId)
    // This would typically navigate to a business profile page
  }, [])

  const handleMessage = useCallback((businessId: string) => {
    // Handle direct messaging
    console.log("Message business:", businessId)
    // This would typically open a chat/messaging interface
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-background via-background to-secondary/20">
      <motion.div
        ref={feedRef}
        className="h-full w-full overflow-y-auto scrollbar-hide feed-snap"
        onScroll={updateCurrentIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence>
          {posts.map((post, index) => (
            <motion.div 
              key={post.id} 
              data-index={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="feed-item"
            >
              <PostCard
                post={post}
                onLike={handleLike}
                onSave={handleSave}
                onComment={handleComment}
                onShare={handleShare}
                onViewProfile={handleViewProfile}
                onMessage={handleMessage}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}