import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChatCircle, Bell } from "@phosphor-icons/react"
import { useKV } from '@github/spark/hooks'
import { useAuth } from "@/contexts/AppContext"

export function MessageNotificationBadge() {
  const { currentUser } = useAuth()
  const [conversations] = useKV<any[]>('conversations', [])
  
  if (!currentUser) return null
  
  const totalUnreadCount = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0)
  
  if (totalUnreadCount === 0) return null

  return (
    <div className="relative">
      <ChatCircle className="w-5 h-5" />
      <Badge 
        variant="destructive" 
        className="absolute -top-2 -right-2 h-5 min-w-[1.25rem] text-xs rounded-full p-0 flex items-center justify-center"
      >
        {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
      </Badge>
    </div>
  )
}

export function NotificationCenter() {
  const { currentUser } = useAuth()
  const [notifications] = useKV<any[]>('notifications', [])
  
  if (!currentUser) return null
  
  const unreadNotifications = notifications.filter(n => !n.isRead)
  
  return (
    <div className="relative">
      <Button variant="ghost" size="sm">
        <Bell className="w-5 h-5" />
        {unreadNotifications.length > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-4 min-w-[1rem] text-xs rounded-full p-0 flex items-center justify-center"
          >
            {unreadNotifications.length > 99 ? '99+' : unreadNotifications.length}
          </Badge>
        )}
      </Button>
    </div>
  )
}