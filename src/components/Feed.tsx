import { useEffect, useState, useRef, useCallback } from "react"
import { useKV } from "@github/spark/hooks"
import { motion, AnimatePresence } from "framer-motion"
import { PostCard } from "@/components/PostCard"
import { BusinessPost } from "@/types/business"
import { generateMockPosts } from "@/lib/mockData"
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
  const [likedPosts, setLikedPosts] = useKV<string[]>("liked-posts", [])
  const [savedPosts, setSavedPosts] = useKV<string[]>("saved-posts", [])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const feedRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const loadPosts = async () => {
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      const mockPosts = generateMockPosts(20)
      const postsWithInteractions = mockPosts.map(post => ({
        ...post,
        isLiked: Array.isArray(likedPosts) ? likedPosts.includes(post.id) : false,
        isSaved: Array.isArray(savedPosts) ? savedPosts.includes(post.id) : false
      }))
      
      setPosts(postsWithInteractions)
      setLoading(false)
    }

    loadPosts()
  }, [likedPosts, savedPosts])

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

  const handleLike = useCallback((postId: string) => {
    setPosts(current => 
      current.map(post => {
        if (post.id === postId) {
          const newIsLiked = !post.isLiked
          return {
            ...post,
            isLiked: newIsLiked,
            likes: newIsLiked ? post.likes + 1 : post.likes - 1
          }
        }
        return post
      })
    )

    setLikedPosts(current => {
      const currentArray = Array.isArray(current) ? current : []
      const newLikedPosts = currentArray.includes(postId)
        ? currentArray.filter(id => id !== postId)
        : [...currentArray, postId]
      return newLikedPosts
    })
  }, [setLikedPosts])

  const handleSave = useCallback((postId: string) => {
    setPosts(current => 
      current.map(post => {
        if (post.id === postId) {
          const newIsSaved = !post.isSaved
          return {
            ...post,
            isSaved: newIsSaved,
            saves: newIsSaved ? post.saves + 1 : post.saves - 1
          }
        }
        return post
      })
    )

    setSavedPosts(current => {
      const currentArray = Array.isArray(current) ? current : []
      const newSavedPosts = currentArray.includes(postId)
        ? currentArray.filter(id => id !== postId)
        : [...currentArray, postId]
      
      if (!currentArray.includes(postId)) {
        toast.success("Post zapisany!", {
          description: "Znajdziesz go w sekcji Zapisane"
        })
      }
      
      return newSavedPosts
    })
  }, [setSavedPosts])

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