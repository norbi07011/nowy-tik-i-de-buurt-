import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/AppContext"
import { useState, useRef, useEffect } from "react"
import { 
  ChatCircle, 
  PaperPlaneTilt, 
  Phone, 
  VideoCamera,
  DotsThreeVertical,
  MagnifyingGlass,
  Plus,
  CaretLeft,
  Circle,
  Image,
  Paperclip
} from "@phosphor-icons/react"
import { format, isToday, isYesterday } from "date-fns"
import { nl } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useKV } from "@/hooks/use-local-storage"
import { toast } from 'sonner'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  createdAt: string
}

interface Conversation {
  id: string
  participantName: string
  participantAvatar?: string
  participantType: 'personal' | 'business'
  lastMessage?: Message
  unreadCount: number
  isOnline: boolean
}

export function ChatMessagesView() {
  const { currentUser } = useAuth()
  const [conversations, setConversations] = useKV<Conversation[]>('conversations', [])
  const [messages, setMessages] = useKV<Record<string, Message[]>>('messages', {})
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showMobileChat, setShowMobileChat] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize with demo data
  useEffect(() => {
    if (currentUser && conversations.length === 0) {
      const demoConversations: Conversation[] = [
        {
          id: 'conv-1',
          participantName: 'Café Central',
          participantType: 'business',
          lastMessage: {
            id: 'msg-1',
            senderId: 'business-1',
            senderName: 'Café Central',
            content: 'Bedankt voor je interesse! We zijn open van 8:00-22:00.',
            createdAt: new Date().toISOString()
          },
          unreadCount: 1,
          isOnline: true
        },
        {
          id: 'conv-2',
          participantName: 'Restaurant De Ooievaar',
          participantType: 'business',
          lastMessage: {
            id: 'msg-2',
            senderId: 'business-2',
            senderName: 'Restaurant De Ooievaar',
            content: 'Je reservering voor vanavond is bevestigd!',
            createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
          },
          unreadCount: 0,
          isOnline: false
        }
      ]
      
      const demoMessages: Record<string, Message[]> = {
        'conv-1': [
          {
            id: 'msg-1-1',
            senderId: currentUser.id,
            senderName: currentUser.name,
            content: 'Hallo, wat zijn jullie openingstijden?',
            createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
          },
          {
            id: 'msg-1-2',
            senderId: 'business-1',
            senderName: 'Café Central',
            content: 'Bedankt voor je interesse! We zijn open van 8:00-22:00.',
            createdAt: new Date().toISOString()
          }
        ],
        'conv-2': [
          {
            id: 'msg-2-1',
            senderId: currentUser.id,
            senderName: currentUser.name,
            content: 'Ik wil graag een tafel reserveren voor vanavond.',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'msg-2-2',
            senderId: 'business-2',
            senderName: 'Restaurant De Ooievaar',
            content: 'Je reservering voor vanavond is bevestigd!',
            createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
          }
        ]
      }
      
      setConversations(demoConversations)
      setMessages(demoMessages)
    }
  }, [currentUser, conversations.length, setConversations, setMessages])

  const selectedConversation = conversations.find(c => c.id === selectedConversationId)
  const conversationMessages = selectedConversationId ? messages[selectedConversationId] || [] : []
  
  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversationMessages])

  const formatMessageTime = (date: string) => {
    const messageDate = new Date(date)
    if (isToday(messageDate)) {
      return format(messageDate, 'HH:mm')
    } else if (isYesterday(messageDate)) {
      return 'Gisteren'
    } else {
      return format(messageDate, 'dd MMM', { locale: nl })
    }
  }

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId)
    setShowMobileChat(true)
    
    // Mark as read
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    )
  }

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversationId || !currentUser) return
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content: messageText.trim(),
      createdAt: new Date().toISOString()
    }

    // Add message to conversation
    setMessages(prev => ({
      ...prev,
      [selectedConversationId]: [...(prev[selectedConversationId] || []), newMessage]
    }))

    // Update last message in conversation
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversationId 
          ? { ...conv, lastMessage: newMessage }
          : conv
      )
    )

    setMessageText("")
    toast.success('Bericht verzonden!')

    // Simulate response after delay
    setTimeout(() => {
      const responseMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        senderId: 'business-response',
        senderName: selectedConversation?.participantName || 'Business',
        content: 'Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.',
        createdAt: new Date().toISOString()
      }

      setMessages(prev => ({
        ...prev,
        [selectedConversationId]: [...(prev[selectedConversationId] || []), responseMessage]
      }))

      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversationId 
            ? { ...conv, lastMessage: responseMessage, unreadCount: conv.unreadCount + 1 }
            : conv
        )
      )

      toast.info(`Nieuw bericht van ${selectedConversation?.participantName}`)
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      participantName: 'Demo Business',
      participantType: 'business',
      unreadCount: 0,
      isOnline: true
    }
    
    setConversations(prev => [newConv, ...prev])
    handleSelectConversation(newConv.id)
    toast.success('Nieuw gesprek gestart!')
  }

  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Conversation List */}
      <div className={cn(
        "w-full lg:w-80 border-r",
        showMobileChat && "hidden lg:block"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Berichten</h2>
                {totalUnreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {totalUnreadCount}
                  </Badge>
                )}
              </div>
              <Button size="sm" onClick={handleNewConversation}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Zoek gesprekken..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            {filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <ChatCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Geen gesprekken gevonden</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const isSelected = selectedConversationId === conversation.id

                return (
                  <div
                    key={conversation.id}
                    className={cn(
                      "flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                      isSelected && "bg-accent"
                    )}
                    onClick={() => handleSelectConversation(conversation.id)}
                  >
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={conversation.participantAvatar} />
                        <AvatarFallback>
                          {conversation.participantName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.isOnline && (
                        <Circle className="absolute -bottom-1 -right-1 w-4 h-4 text-green-500 fill-current" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{conversation.participantName}</h3>
                        <div className="flex items-center gap-2">
                          {conversation.lastMessage && (
                            <span className="text-xs text-muted-foreground">
                              {formatMessageTime(conversation.lastMessage.createdAt)}
                            </span>
                          )}
                          {conversation.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs min-w-[1.5rem] h-6 rounded-full">
                              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {conversation.lastMessage && (
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {conversation.lastMessage.senderId === currentUser?.id ? 'Jij: ' : ''}
                          {conversation.lastMessage.content}
                        </p>
                      )}
                      
                      {conversation.participantType === 'business' && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          Bedrijf
                        </Badge>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </ScrollArea>
        </div>
      </div>
      
      {/* Chat View */}
      <div className={cn(
        "flex-1",
        !showMobileChat && selectedConversationId && "hidden lg:block"
      )}>
        {selectedConversation ? (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowMobileChat(false)} 
                className="lg:hidden"
              >
                <CaretLeft className="w-4 h-4" />
              </Button>
              
              <Avatar className="w-10 h-10">
                <AvatarImage src={selectedConversation.participantAvatar} />
                <AvatarFallback>
                  {selectedConversation.participantName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h3 className="font-semibold">{selectedConversation.participantName}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedConversation.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <VideoCamera className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <DotsThreeVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {conversationMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                  <div>
                    <ChatCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nog geen berichten</p>
                    <p className="text-sm">Start het gesprek door een bericht te sturen!</p>
                  </div>
                </div>
              ) : (
                <>
                  {conversationMessages.map((message, index) => {
                    const isOwn = message.senderId === currentUser?.id
                    const prevMessage = conversationMessages[index - 1]
                    const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId
                    
                    return (
                      <div key={message.id} className={cn("flex gap-2 mb-4", isOwn ? "justify-end" : "justify-start")}>
                        {!isOwn && showAvatar && (
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={message.senderAvatar} />
                            <AvatarFallback className="text-xs">
                              {message.senderName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        {!isOwn && !showAvatar && <div className="w-8" />}
                        
                        <div className={cn("max-w-xs lg:max-w-md", isOwn ? "order-1" : "order-2")}>
                          <div
                            className={cn(
                              "px-4 py-2 rounded-2xl",
                              isOwn
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            )}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          </div>
                          
                          <div className={cn("flex items-center gap-1 mt-1", isOwn ? "justify-end" : "justify-start")}>
                            <span className="text-xs text-muted-foreground">
                              {formatMessageTime(message.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </ScrollArea>
            
            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Image className="w-4 h-4" />
                </Button>
                
                <div className="flex-1 relative">
                  <Input
                    placeholder="Typ een bericht..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pr-12"
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  >
                    <PaperPlaneTilt className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex items-center justify-center h-full text-center text-muted-foreground">
            <div>
              <ChatCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-semibold mb-2">Selecteer een gesprek</h2>
              <p>Kies een gesprek uit de lijst om berichten te bekijken</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}