import { useState, useEffect, useRef } from "react"
import { useKV } from "@/hooks/use-local-storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  PaperAirplaneIcon, 
  PhotoIcon, 
  MapPinIcon,
  EllipsisVerticalIcon,
  PhoneIcon,
  VideoCameraIcon
} from "@heroicons/react/24/outline"
import { 
  ChatCircle, 
  Phone, 
  VideoCamera, 
  PaperPlaneTilt, 
  Camera, 
  MapPin, 
  DotsThreeVertical,
  CheckCircle,
  Circle
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: string
  isRead: boolean
  type: 'text' | 'image' | 'location'
  attachments?: string[]
}

interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantAvatar?: string
  participantType: 'user' | 'business'
  lastMessage?: Message
  unreadCount: number
  isOnline: boolean
  lastSeen?: string
  isTyping: boolean
}

interface MessageCenterProps {
  currentUserId: string
  currentUserName: string
  currentUserType: 'user' | 'business'
}

export function MessageCenter({ currentUserId, currentUserName, currentUserType }: MessageCenterProps) {
  const [conversations, setConversations] = useKV<Conversation[]>("conversations", [])
  const [messages, setMessages] = useKV<Record<string, Message[]>>("messages", {})
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [onlineUsers, setOnlineUsers] = useKV<string[]>("online-users", [])
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Mock data initialization
  useEffect(() => {
    if (!conversations || conversations.length === 0) {
      const mockConversations: Conversation[] = [
        {
          id: "conv-1",
          participantId: "user-123",
          participantName: "Anna van der Berg",
          participantAvatar: undefined,
          participantType: "user",
          unreadCount: 2,
          isOnline: true,
          isTyping: false,
          lastMessage: {
            id: "msg-1",
            conversationId: "conv-1",
            senderId: "user-123",
            senderName: "Anna van der Berg",
            content: "Bedankt voor de snelle reactie! Wanneer kan ik langskomen?",
            timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
            isRead: false,
            type: 'text'
          }
        },
        {
          id: "conv-2",
          participantId: "business-456",
          participantName: "Restaurant De Kroon",
          participantAvatar: undefined,
          participantType: "business",
          unreadCount: 0,
          isOnline: false,
          lastSeen: new Date(Date.now() - 30 * 60000).toISOString(),
          isTyping: false,
          lastMessage: {
            id: "msg-2",
            conversationId: "conv-2",
            senderId: currentUserId,
            senderName: currentUserName,
            content: "Graag zou ik een tafel reserveren voor vanavond",
            timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
            isRead: true,
            type: 'text'
          }
        }
      ]
      setConversations(mockConversations)

      // Mock messages
      const mockMessages: Record<string, Message[]> = {
        "conv-1": [
          {
            id: "msg-1a",
            conversationId: "conv-1",
            senderId: "user-123",
            senderName: "Anna van der Berg",
            content: "Hallo! Ik heb interesse in jullie services. Kunnen jullie me meer informatie geven?",
            timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
            isRead: true,
            type: 'text'
          },
          {
            id: "msg-1b",
            conversationId: "conv-1",
            senderId: currentUserId,
            senderName: currentUserName,
            content: "Hallo Anna! Natuurlijk, graag help ik je verder. Waar kan ik je mee helpen?",
            timestamp: new Date(Date.now() - 1.5 * 60 * 60000).toISOString(),
            isRead: true,
            type: 'text'
          },
          {
            id: "msg-1c",
            conversationId: "conv-1",
            senderId: "user-123",
            senderName: "Anna van der Berg",
            content: "Bedankt voor de snelle reactie! Wanneer kan ik langskomen?",
            timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
            isRead: false,
            type: 'text'
          }
        ],
        "conv-2": [
          {
            id: "msg-2a",
            conversationId: "conv-2",
            senderId: currentUserId,
            senderName: currentUserName,
            content: "Graag zou ik een tafel reserveren voor vanavond",
            timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
            isRead: true,
            type: 'text'
          }
        ]
      }
      setMessages(mockMessages)
    }
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, selectedConversationId])

  // Handle typing indicator
  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true)
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
    }, 1000)
  }

  const selectedConversation = conversations?.find(c => c.id === selectedConversationId)
  const conversationMessages = selectedConversationId ? messages?.[selectedConversationId] || [] : []

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversationId) return

    const message: Message = {
      id: Date.now().toString(),
      conversationId: selectedConversationId,
      senderId: currentUserId,
      senderName: currentUserName,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isRead: true,
      type: 'text'
    }

    // Add message
    const updatedMessages = {
      ...messages,
      [selectedConversationId]: [...(messages?.[selectedConversationId] || []), message]
    }
    setMessages(updatedMessages)

    // Update conversation last message
    const updatedConversations = (conversations || []).map(conv =>
      conv.id === selectedConversationId
        ? { ...conv, lastMessage: message, isTyping: false }
        : conv
    )
    setConversations(updatedConversations)

    setNewMessage("")
    setIsTyping(false)
    toast.success("Bericht verzonden")
  }

  const markAsRead = (conversationId: string) => {
    const updatedConversations = (conversations || []).map(conv =>
      conv.id === conversationId
        ? { ...conv, unreadCount: 0 }
        : conv
    )
    setConversations(updatedConversations)

    // Mark messages as read
    const conversationMessages = messages?.[conversationId] || []
    const updatedMessages = conversationMessages.map(msg => ({ ...msg, isRead: true }))
    setMessages(prev => ({
      ...prev,
      [conversationId]: updatedMessages
    }))
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "nu"
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}u`
    if (diffDays < 7) return `${diffDays}d`
    return date.toLocaleDateString('nl-NL', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="flex h-full max-h-[600px] border rounded-lg overflow-hidden">
      {/* Conversations List */}
      <div className="w-80 border-r bg-muted/30">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Berichten</h3>
          <p className="text-sm text-muted-foreground">
            {(conversations || []).reduce((sum, conv) => sum + conv.unreadCount, 0)} ongelezen
          </p>
        </div>
        
        <ScrollArea className="h-full">
          <div className="space-y-1 p-2">
            {(conversations || []).map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                  selectedConversationId === conversation.id ? "bg-primary/10" : "hover:bg-muted/50"
                )}
                onClick={() => {
                  setSelectedConversationId(conversation.id)
                  markAsRead(conversation.id)
                }}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.participantAvatar} />
                    <AvatarFallback>
                      {conversation.participantName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm truncate">
                      {conversation.participantName}
                    </h4>
                    <div className="flex items-center gap-1">
                      {conversation.lastMessage && (
                        <span className="text-xs text-muted-foreground">
                          {formatTime(conversation.lastMessage.timestamp)}
                        </span>
                      )}
                      {conversation.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 mt-1">
                    {conversation.isTyping ? (
                      <span className="text-xs text-primary italic">Aan het typen...</span>
                    ) : conversation.lastMessage ? (
                      <p className="text-xs text-muted-foreground truncate">
                        {conversation.lastMessage.senderId === currentUserId && "Je: "}
                        {conversation.lastMessage.content}
                      </p>
                    ) : (
                      <span className="text-xs text-muted-foreground">Geen berichten</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={selectedConversation.participantAvatar} />
                    <AvatarFallback>
                      {selectedConversation.participantName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {selectedConversation.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold">{selectedConversation.participantName}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedConversation.isOnline ? "Online" : 
                     selectedConversation.lastSeen ? `Actief ${formatTime(selectedConversation.lastSeen)} geleden` : "Offline"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Phone size={16} />
                </Button>
                <Button variant="ghost" size="sm">
                  <VideoCamera size={16} />
                </Button>
                <Button variant="ghost" size="sm">
                  <DotsThreeVertical size={16} />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {conversationMessages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2 max-w-[80%]",
                      message.senderId === currentUserId ? "ml-auto" : "mr-auto"
                    )}
                  >
                    {message.senderId !== currentUserId && (
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={selectedConversation.participantAvatar} />
                        <AvatarFallback className="text-xs">
                          {selectedConversation.participantName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm break-words",
                        message.senderId === currentUserId
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <p>{message.content}</p>
                      <div className={cn(
                        "flex items-center gap-1 mt-1 text-xs",
                        message.senderId === currentUserId ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>
                        <span>{formatTime(message.timestamp)}</span>
                        {message.senderId === currentUserId && (
                          message.isRead ? (
                            <CheckCircle size={12} />
                          ) : (
                            <Circle size={12} />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {selectedConversation.isTyping && (
                  <div className="flex gap-2 max-w-[80%] mr-auto">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={selectedConversation.participantAvatar} />
                      <AvatarFallback className="text-xs">
                        {selectedConversation.participantName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg px-3 py-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Camera size={16} />
                </Button>
                <Button variant="ghost" size="sm">
                  <MapPin size={16} />
                </Button>
                
                <div className="flex-1 relative">
                  <Input
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value)
                      handleTyping()
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                    placeholder="Typ een bericht..."
                    className="pr-10"
                  />
                  {isTyping && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="text-xs text-muted-foreground">Typing...</div>
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  size="sm"
                >
                  <PaperPlaneTilt size={16} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ChatCircle size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">Selecteer een gesprek</h3>
              <p className="text-muted-foreground">
                Kies een gesprek uit de lijst om berichten te bekijken
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}