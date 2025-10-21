import { supabase } from './supabase'
import { toast } from 'sonner'

export interface Post {
  id: string
  user_id: string
  business_id?: string
  type: string
  title?: string
  content: string
  location?: string
  city?: string
  tags?: string[]
  price?: number
  is_promoted: boolean
  is_featured: boolean
  views_count: number
  likes_count: number
  comments_count: number
  shares_count: number
  saves_count: number
  created_at: string
  updated_at: string
  profiles?: {
    name: string
    profile_image?: string
    account_type: string
  }
  business_profiles?: {
    business_name: string
    logo_image?: string
    category?: string
    is_verified: boolean
  }
  post_media?: Array<{
    url: string
    type: string
  }>
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  content: string
  likes_count: number
  created_at: string
  profiles?: {
    name: string
    profile_image?: string
  }
}

export class SupabaseAPI {
  async getPosts(limit: number = 20, offset: number = 0): Promise<Post[]> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_user_id_fkey (
            name,
            profile_image,
            account_type
          ),
          business_profiles!posts_business_id_fkey (
            business_name,
            logo_image,
            category,
            is_verified
          ),
          post_media (
            url,
            type
          )
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching posts:', error)
      return []
    }
  }

  async createPost(postData: {
    content: string
    title?: string
    type?: string
    location?: string
    city?: string
    tags?: string[]
    price?: number
    business_id?: string
  }): Promise<Post | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: postData.content,
          title: postData.title,
          type: postData.type || 'standard',
          location: postData.location,
          city: postData.city,
          tags: postData.tags,
          price: postData.price,
          business_id: postData.business_id
        })
        .select()
        .single()

      if (error) throw error
      toast.success('Post utworzony!')
      return data
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error('Błąd podczas tworzenia posta')
      return null
    }
  }

  async addPostMedia(postId: string, mediaUrl: string, mediaType: 'image' | 'video' = 'image'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('post_media')
        .insert({
          post_id: postId,
          url: mediaUrl,
          type: mediaType
        })

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error adding post media:', error)
      return false
    }
  }

  async likePost(postId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle()

      if (existingLike) {
        const { error: deleteError } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id)

        if (deleteError) throw deleteError

        const { error: updateError } = await supabase.rpc('decrement_post_likes', {
          post_id: postId
        })
        if (updateError) throw updateError

        return false
      } else {
        const { error: insertError } = await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          })

        if (insertError) throw insertError

        const { error: updateError } = await supabase.rpc('increment_post_likes', {
          post_id: postId
        })
        if (updateError) throw updateError

        return true
      }
    } catch (error) {
      console.error('Error liking post:', error)
      return false
    }
  }

  async savePost(postId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: existingSave } = await supabase
        .from('post_saves')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle()

      if (existingSave) {
        const { error } = await supabase
          .from('post_saves')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id)

        if (error) throw error

        const { error: updateError } = await supabase.rpc('decrement_post_saves', {
          post_id: postId
        })
        if (updateError) throw updateError

        toast.success('Post usunięty z zapisanych')
        return false
      } else {
        const { error } = await supabase
          .from('post_saves')
          .insert({
            post_id: postId,
            user_id: user.id
          })

        if (error) throw error

        const { error: updateError } = await supabase.rpc('increment_post_saves', {
          post_id: postId
        })
        if (updateError) throw updateError

        toast.success('Post zapisany!')
        return true
      }
    } catch (error) {
      console.error('Error saving post:', error)
      return false
    }
  }

  async getSavedPosts(): Promise<Post[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('post_saves')
        .select(`
          post_id,
          posts (
            *,
            profiles!posts_user_id_fkey (
              name,
              profile_image,
              account_type
            ),
            business_profiles!posts_business_id_fkey (
              business_name,
              logo_image,
              category,
              is_verified
            ),
            post_media (
              url,
              type
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data?.map(item => item.posts).filter(Boolean) || []
    } catch (error) {
      console.error('Error fetching saved posts:', error)
      return []
    }
  }

  async getComments(postId: string): Promise<Comment[]> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles (
            name,
            profile_image
          )
        `)
        .eq('post_id', postId)
        .is('parent_id', null)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching comments:', error)
      return []
    }
  }

  async addComment(postId: string, content: string): Promise<Comment | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content
        })
        .select(`
          *,
          profiles (
            name,
            profile_image
          )
        `)
        .single()

      if (error) throw error

      const { error: updateError } = await supabase.rpc('increment_post_comments', {
        post_id: postId
      })
      if (updateError) console.error('Error updating comment count:', updateError)

      toast.success('Komentarz dodany!')
      return data
    } catch (error) {
      console.error('Error adding comment:', error)
      toast.error('Błąd podczas dodawania komentarza')
      return null
    }
  }

  async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          business_profiles (*)
        `)
        .eq('id', userId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  async updateProfile(userId: string, updates: {
    name?: string
    bio?: string
    profile_image?: string
    phone?: string
    city?: string
    location?: string
  }) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      toast.success('Profil zaktualizowany!')
      return data
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Błąd podczas aktualizacji profilu')
      return null
    }
  }

  async followUser(followingId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: existingFollow } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', followingId)
        .maybeSingle()

      if (existingFollow) {
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', followingId)

        if (error) throw error
        toast.success('Przestałeś obserwować')
        return false
      } else {
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: followingId
          })

        if (error) throw error
        toast.success('Teraz obserwujesz tego użytkownika!')
        return true
      }
    } catch (error) {
      console.error('Error following user:', error)
      return false
    }
  }

  async getFollowers(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select(`
          follower_id,
          profiles!follows_follower_id_fkey (
            id,
            name,
            profile_image
          )
        `)
        .eq('following_id', userId)

      if (error) throw error
      return data?.map(item => item.profiles).filter(Boolean) || []
    } catch (error) {
      console.error('Error fetching followers:', error)
      return []
    }
  }

  async getFollowing(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select(`
          following_id,
          profiles!follows_following_id_fkey (
            id,
            name,
            profile_image
          )
        `)
        .eq('follower_id', userId)

      if (error) throw error
      return data?.map(item => item.profiles).filter(Boolean) || []
    } catch (error) {
      console.error('Error fetching following:', error)
      return []
    }
  }

  async getNotifications(): Promise<any[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching notifications:', error)
      return []
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error marking notification as read:', error)
      return false
    }
  }

  async getConversations(): Promise<any[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participant_1:profiles!conversations_participant_1_id_fkey (
            id,
            name,
            profile_image
          ),
          participant_2:profiles!conversations_participant_2_id_fkey (
            id,
            name,
            profile_image
          ),
          messages (
            id,
            content,
            created_at,
            is_read
          )
        `)
        .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`)
        .order('updated_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching conversations:', error)
      return []
    }
  }

  async getMessages(conversationId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey (
            id,
            name,
            profile_image
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching messages:', error)
      return []
    }
  }

  async sendMessage(conversationId: string, content: string): Promise<any | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content,
          type: 'text'
        })
        .select()
        .single()

      if (error) throw error

      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId)

      return data
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Błąd podczas wysyłania wiadomości')
      return null
    }
  }

  async createConversation(participantId: string): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(participant_1_id.eq.${user.id},participant_2_id.eq.${participantId}),and(participant_1_id.eq.${participantId},participant_2_id.eq.${user.id})`)
        .maybeSingle()

      if (existing) {
        return existing.id
      }

      const { data, error } = await supabase
        .from('conversations')
        .insert({
          participant_1_id: user.id,
          participant_2_id: participantId
        })
        .select('id')
        .single()

      if (error) throw error
      return data.id
    } catch (error) {
      console.error('Error creating conversation:', error)
      return null
    }
  }
}

export const supabaseApi = new SupabaseAPI()
