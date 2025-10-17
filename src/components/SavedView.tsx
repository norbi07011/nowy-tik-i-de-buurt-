import { useKV } from "@github/spark/hooks"
import { PostCard } from "@/components/PostCard"
import { BusinessPost } from "@/types/business"
import { generateMockPosts } from "@/lib/mockData"
import { useEffect, useState, useCallback } from "react"
import { Heart } from "@phosphor-icons/react"
import { toast } from "sonner"

export function SavedView() {
  const [savedPosts, setSavedPosts] = useKV<string[]>("saved-posts", [])
  const [likedPosts, setLikedPosts] = useKV<string[]>("liked-posts", [])
  const [allPosts, setAllPosts] = useState<BusinessPost[]>([])
  const [savedPostsData, setSavedPostsData] = useState<BusinessPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const mockPosts = generateMockPosts(20)
    setAllPosts(mockPosts)
  }, [])

  useEffect(() => {
    if (allPosts.length > 0) {
      const savedData = allPosts
        .filter(post => Array.isArray(savedPosts) ? savedPosts.includes(post.id) : false)
        .map(post => ({
          ...post,
          isLiked: Array.isArray(likedPosts) ? likedPosts.includes(post.id) : false,
          isSaved: true
        }))
      
      setSavedPostsData(savedData)
      setLoading(false)
    }
  }, [allPosts, savedPosts, likedPosts])

  const handleLike = useCallback((postId: string) => {
    setSavedPostsData(current => 
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
    setSavedPosts(current => {
      const currentArray = Array.isArray(current) ? current : []
      const newSavedPosts = currentArray.filter(id => id !== postId)
      toast.success("Post removed from saved!")
      return newSavedPosts
    })
  }, [setSavedPosts])

  const handleComment = useCallback((postId: string) => {
    const post = savedPostsData.find(p => p.id === postId)
    if (post) {
      toast.info(`Opening comments for ${post.businessName}`)
    }
  }, [savedPostsData])

  const handleShare = useCallback((postId: string) => {
    const post = savedPostsData.find(p => p.id === postId)
    if (post) {
      if (navigator.share) {
        navigator.share({
          title: post.title,
          text: post.description,
          url: window.location.href
        })
      } else {
        navigator.clipboard.writeText(window.location.href)
        toast.success("Link copied to clipboard!")
      }
    }
  }, [savedPostsData])

  if (loading) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-sm">Loading your saved posts...</p>
        </div>
      </div>
    )
  }

  if (savedPostsData.length === 0) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center px-8">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Heart size={32} className="text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-white text-xl font-semibold">No saved posts yet</h2>
            <p className="text-white/70 text-sm">
              Start exploring local businesses and save your favorites!
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-full overflow-y-auto scrollbar-hide feed-snap bg-black">
      {savedPostsData.map((post) => (
        <div key={post.id}>
          <PostCard
            post={post}
            onLike={handleLike}
            onSave={handleSave}
            onComment={handleComment}
            onShare={handleShare}
          />
        </div>
      ))}
    </div>
  )
}