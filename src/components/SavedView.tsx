import { PostCard } from "@/components/PostCard"
import { BusinessPost } from "@/types/business"
import { supabaseApi, Post as SupabasePost } from "@/lib/supabaseApi"
import { useEffect, useState, useCallback } from "react"
import { Heart, BookmarkSimple } from "@phosphor-icons/react"
import { toast } from "sonner"

export function SavedView() {
  const [savedPostsData, setSavedPostsData] = useState<BusinessPost[]>([])
  const [loading, setLoading] = useState(true)

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
      isSaved: true,
      isVerified: businessProfile?.is_verified || false,
      tags: post.tags || []
    }
  }

  useEffect(() => {
    const loadSavedPosts = async () => {
      setLoading(true)
      try {
        const supabasePosts = await supabaseApi.getSavedPosts()
        const convertedPosts = supabasePosts.map(convertSupabasePostToBusinessPost)
        setSavedPostsData(convertedPosts)
      } catch (error) {
        console.error('Error loading saved posts:', error)
        toast.error('Błąd podczas ładowania zapisanych postów')
      } finally {
        setLoading(false)
      }
    }

    loadSavedPosts()
  }, [])

  const handleLike = useCallback(async (postId: string) => {
    const post = savedPostsData.find(p => p.id === postId)
    if (!post) return

    const newIsLiked = !post.isLiked

    setSavedPostsData(current =>
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

    await supabaseApi.likePost(postId)
  }, [savedPostsData])

  const handleSave = useCallback(async (postId: string) => {
    setSavedPostsData(current => current.filter(p => p.id !== postId))
    await supabaseApi.savePost(postId)
  }, [])

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