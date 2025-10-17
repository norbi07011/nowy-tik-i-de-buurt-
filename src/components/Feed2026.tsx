import { useEffect, useState, useRef, useCallback } from "react"
import { useKV } from "@/hooks/use-local-storage"
import { motion, AnimatePresence } from "framer-motion"
import { PostCard } from "@/components/PostCard"
import { BusinessPost } from "@/types/business"
import { generateMockPosts } from "@/lib/mockData"
import { toast } from "sonner"

const LoadingSpinner = () => (
  <motion.div 
    className="h-screen w-full flex items-center justify-center relative overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    {/* Premium Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
    
    {/* Floating Elements */}
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-white/20 rounded-full"
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

    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-8 relative z-10"
    >
      {/* Premium Loader */}
      <div className="relative">
        <motion.div 
          className="w-20 h-20 rounded-full border-4 border-transparent bg-gradient-to-r from-blue-500 to-purple-600 p-1"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full rounded-full bg-black/80 backdrop-blur-xl" />
        </motion.div>
        
        {/* Inner rotating element */}
        <motion.div 
          className="absolute inset-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center dot */}
        <motion.div 
          className="absolute inset-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <motion.h3 
          className="text-white text-2xl font-bold mb-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Ładowanie premium treści...
        </motion.h3>
        <p className="text-white/70 text-lg font-light">
          Odkrywamy najlepsze lokalne firmy dla Ciebie
        </p>
        
        {/* Progress dots */}
        <motion.div className="flex gap-2 mt-6 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-white/40 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  </motion.div>
)

export function Feed() {
  const [posts, setPosts] = useState<BusinessPost[]>([])
  const [likedPosts, setLikedPosts] = useKV<string[]>("liked-posts", [])
  const [savedPosts, setSavedPosts] = useKV<string[]>("saved-posts", [])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const feedRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Initialize posts
  useEffect(() => {
    const initializePosts = async () => {
      setLoading(true)
      try {
        // Simulate loading time for premium experience
        await new Promise(resolve => setTimeout(resolve, 1500))
        const mockPosts = generateMockPosts(20)
        setPosts(mockPosts)
      } catch (error) {
        console.error("Error loading posts:", error)
        toast.error("Błąd podczas ładowania postów")
      } finally {
        setLoading(false)
      }
    }

    initializePosts()
  }, [])

  // Handle like toggle
  const handleLike = useCallback((postId: string) => {
    setLikedPosts(prev => {
      const currentLiked = prev || []
      const isLiked = currentLiked.includes(postId)
      if (isLiked) {
        return currentLiked.filter(id => id !== postId)
      } else {
        return [...currentLiked, postId]
      }
    })
  }, [setLikedPosts])

  // Handle save toggle
  const handleSave = useCallback((postId: string) => {
    setSavedPosts(prev => {
      const currentSaved = prev || []
      const isSaved = currentSaved.includes(postId)
      if (isSaved) {
        toast.success("Usunięto z zapisanych")
        return currentSaved.filter(id => id !== postId)
      } else {
        toast.success("Dodano do zapisanych")
        return [...currentSaved, postId]
      }
    })
  }, [setSavedPosts])

  // Intersection Observer for current post tracking
  useEffect(() => {
    if (!feedRef.current) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0')
            setCurrentIndex(index)
          }
        })
      },
      { 
        threshold: 0.6,
        rootMargin: '-20% 0px -20% 0px'
      }
    )

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [posts])

  // Observe post elements
  useEffect(() => {
    if (!observerRef.current || !feedRef.current) return

    const postElements = feedRef.current.querySelectorAll('[data-index]')
    postElements.forEach(el => observerRef.current?.observe(el))

    return () => {
      postElements.forEach(el => observerRef.current?.unobserve(el))
    }
  }, [posts])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <motion.div 
      className="h-full flex flex-col relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Premium Header */}
      <motion.div 
        className="glass border-b border-white/20 p-6 relative z-20"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <motion.h1 
              className="text-2xl font-bold text-premium"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Lokalne Odkrycia
            </motion.h1>
            <motion.p 
              className="text-white/70 mt-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              Najlepsze firmy w Twojej okolicy
            </motion.p>
          </div>
          
          {/* Post Counter */}
          <motion.div 
            className="glass-strong px-4 py-2 rounded-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-white font-semibold">
              {currentIndex + 1} / {posts.length}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Feed Content */}
      <motion.div 
        ref={feedRef}
        className="flex-1 overflow-y-auto relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-transparent pointer-events-none" />
        
        <div className="space-y-6 p-6 relative z-10">
          <AnimatePresence initial={false}>
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                data-index={index}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.95 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                whileInView={{ 
                  scale: [0.95, 1.02, 1],
                  transition: { duration: 0.4 }
                }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <motion.div
                  className="card-premium relative overflow-hidden"
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.3 }
                  }}
                >
                  {/* Premium Border Glow */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
                    animate={{ left: ["-100%", "100%"] }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      repeatDelay: 5,
                      ease: "easeInOut"
                    }}
                  />
                  
                  <PostCard
                    post={post}
                    onLike={() => handleLike(post.id)}
                    onSave={() => handleSave(post.id)}
                    onComment={() => {}}
                    onShare={() => {}}
                  />
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* End of feed indicator */}
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div 
              className="glass-strong inline-flex items-center gap-3 px-6 py-3 rounded-2xl"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse" />
              <span className="text-white font-medium">
                To wszystko na dziś! 🎉
              </span>
            </motion.div>
            <motion.p 
              className="text-white/60 mt-3 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Wróć jutro po więcej lokalnych odkryć
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-30"
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        onClick={() => {
          feedRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      >
        <motion.div
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center justify-center h-full"
        >
          <svg 
            className="w-6 h-6 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.div>
      </motion.button>
    </motion.div>
  )
}