import { useState, useEffect, useCallback, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Conversation, Message, User } from '@/types'
import { apiService } from '@/services/api'
import { toast } from 'sonner'

export function useMessaging(currentUser: User | null) {
  const [conversations, setConversations] = useKV<Conversation[]>('conversations', [])
  const [activeConversationId, setActiveConversationId] = useKV<string | null>('active-conversation', null)
  const [messages, setMessages] = useKV<Record<string, Message[]>>('conversation-messages', {})
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({})
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({})
  const [unreadCounts, setUnreadCounts] = useKV<Record<string, number>>('unread-counts', {})
  const [isLoading, setIsLoading] = useState(false)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const typingTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({})

  const activeConversation = conversations.find(c => c.id === activeConversationId) || null

  const loadConversations = useCallback(async () => {
    if (!currentUser) return
    
    try {
      setIsLoading(true)
      const response = await apiService.getConversations(currentUser.id)
      if (response.success && response.data) {
        setConversations(response.data)
        
        const counts: Record<string, number> = {}
        response.data.forEach(conv => {
          counts[conv.id] = conv.unreadCount
        })
        setUnreadCounts(counts)
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
      toast.error('Fout bij het laden van gesprekken')
    } finally {
      setIsLoading(false)
    }
  }, [currentUser, setConversations, setUnreadCounts])

  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const response = await apiService.getMessages(conversationId)
      if (response.success && response.data) {
        setMessages(prev => ({
          ...prev,
          [conversationId]: response.data!
        }))
        
        setUnreadCounts(prev => ({
          ...prev,
          [conversationId]: 0
        }))
        
        setConversations(prev => 
          prev.map(conv => 
            conv.id === conversationId 
              ? { ...conv, unreadCount: 0 }
              : conv
          )
        )
      }
    } catch (error) {
      console.error('Error loading messages:', error)
      toast.error('Fout bij het laden van berichten')
    }
  }, [setMessages, setUnreadCounts, setConversations])

  const sendMessage = useCallback(async (
    conversationId: string, 
    content: string, 
    type: 'text' | 'image' | 'file' | 'location' = 'text'
  ) => {
    if (!currentUser || !content.trim()) return

    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content: content.trim(),
      type,
      createdAt: new Date().toISOString()
    }

    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), tempMessage]
    }))

    try {
      const response = await apiService.sendMessage({
        conversationId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        content: content.trim(),
        type
      })

      if (response.success && response.data) {
        setMessages(prev => ({
          ...prev,
          [conversationId]: (prev[conversationId] || []).map(msg => 
            msg.id === tempMessage.id ? response.data! : msg
          )
        }))

        setConversations(prev => 
          prev.map(conv => 
            conv.id === conversationId 
              ? { ...conv, lastMessage: response.data!, updatedAt: response.data!.createdAt }
              : conv
          )
        )

        simulateMessageDelivery(conversationId, response.data)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Fout bij het verzenden van bericht')
      
      setMessages(prev => ({
        ...prev,
        [conversationId]: (prev[conversationId] || []).filter(msg => msg.id !== tempMessage.id)
      }))
    }
  }, [currentUser, setMessages, setConversations])

  const startConversation = useCallback(async (participantId: string, participantName: string, accountType: 'personal' | 'business') => {
    if (!currentUser) return null

    const existingConv = conversations.find(conv => 
      conv.participants.some(p => p.userId === participantId)
    )
    
    if (existingConv) {
      setActiveConversationId(existingConv.id)
      return existingConv
    }

    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      participants: [
        {
          userId: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          accountType: currentUser.accountType
        },
        {
          userId: participantId,
          name: participantName,
          accountType
        }
      ],
      unreadCount: 0,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setConversations(prev => [newConversation, ...prev])
    setActiveConversationId(newConversation.id)
    setMessages(prev => ({ ...prev, [newConversation.id]: [] }))
    
    return newConversation
  }, [currentUser, conversations, setConversations, setActiveConversationId, setMessages])

  const setActiveConversation = useCallback((conversationId: string | null) => {
    setActiveConversationId(conversationId)
    if (conversationId) {
      loadMessages(conversationId)
    }
  }, [setActiveConversationId, loadMessages])

  const setTyping = useCallback((conversationId: string, isTyping: boolean) => {
    if (!currentUser) return

    setTypingUsers(prev => {
      const current = prev[conversationId] || []
      if (isTyping) {
        if (!current.includes(currentUser.name)) {
          return { ...prev, [conversationId]: [...current, currentUser.name] }
        }
      } else {
        return { ...prev, [conversationId]: current.filter(name => name !== currentUser.name) }
      }
      return prev
    })

    if (isTyping) {
      if (typingTimeoutRef.current[conversationId]) {
        clearTimeout(typingTimeoutRef.current[conversationId])
      }
      typingTimeoutRef.current[conversationId] = setTimeout(() => {
        setTypingUsers(prev => ({
          ...prev,
          [conversationId]: (prev[conversationId] || []).filter(name => name !== currentUser.name)
        }))
      }, 3000)
    }
  }, [currentUser])

  const simulateMessageDelivery = useCallback((conversationId: string, message: Message) => {
    setTimeout(() => {
      if (message.senderId !== currentUser?.id) {
        if (activeConversationId !== conversationId) {
          setUnreadCounts(prev => ({
            ...prev,
            [conversationId]: (prev[conversationId] || 0) + 1
          }))
          
          setConversations(prev => 
            prev.map(conv => 
              conv.id === conversationId 
                ? { ...conv, unreadCount: (conv.unreadCount || 0) + 1 }
                : conv
            )
          )
        }
        
        toast.info(`Nieuw bericht van ${message.senderName}`)
      }
    }, Math.random() * 2000 + 500)
  }, [currentUser, activeConversationId, setUnreadCounts, setConversations])

  useEffect(() => {
    if (!currentUser) return

    const updateOnlineStatus = () => {
      const users = conversations.flatMap(conv => conv.participants)
      const status: Record<string, boolean> = {}
      users.forEach(user => {
        status[user.userId] = Math.random() > 0.3
      })
      setOnlineUsers(status)
    }

    const simulateIncomingMessage = () => {
      if (conversations.length > 0 && Math.random() > 0.8) {
        const randomConv = conversations[Math.floor(Math.random() * conversations.length)]
        const otherParticipant = randomConv.participants.find(p => p.userId !== currentUser.id)
        
        if (otherParticipant) {
          const responses = [
            'Bedankt voor je bericht!',
            'Dat klinkt goed, laten we een afspraak maken.',
            'We zijn vandaag open tot 22:00.',
            'Graag tot ziens!',
            'Heb je nog vragen?'
          ]
          
          const randomResponse = responses[Math.floor(Math.random() * responses.length)]
          
          const incomingMessage: Message = {
            id: `incoming-${Date.now()}`,
            conversationId: randomConv.id,
            senderId: otherParticipant.userId,
            senderName: otherParticipant.name,
            senderAvatar: otherParticipant.avatar,
            content: randomResponse,
            type: 'text',
            createdAt: new Date().toISOString()
          }
          
          setMessages(prev => ({
            ...prev,
            [randomConv.id]: [...(prev[randomConv.id] || []), incomingMessage]
          }))
          
          simulateMessageDelivery(randomConv.id, incomingMessage)
        }
      }
    }

    updateOnlineStatus()
    intervalRef.current = setInterval(() => {
      updateOnlineStatus()
      simulateIncomingMessage()
    }, 10000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      Object.values(typingTimeoutRef.current).forEach(timeout => clearTimeout(timeout))
    }
  }, [currentUser, conversations, setMessages, simulateMessageDelivery])

  useEffect(() => {
    if (currentUser) {
      loadConversations()
    }
  }, [currentUser, loadConversations])

  return {
    conversations,
    activeConversation,
    messages: activeConversationId ? messages[activeConversationId] || [] : [],
    allMessages: messages,
    typingUsers: activeConversationId ? typingUsers[activeConversationId] || [] : [],
    onlineUsers,
    unreadCounts,
    totalUnreadCount: Object.values(unreadCounts || {}).reduce((sum, count) => sum + count, 0),
    isLoading,
    
    sendMessage,
    startConversation,
    setActiveConversation,
    setTyping,
    loadConversations,
    loadMessages
  }
}