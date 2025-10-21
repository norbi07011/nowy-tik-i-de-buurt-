import { Bell, Heart, ChatCircle, ShoppingBag, Star, UserPlus } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useKV } from "@/hooks/use-local-storage"
import { useState, useEffect } from "react"

type NotificationType = "like" | "comment" | "follow" | "order" | "review" | "promotion"

type Notification = {
  id: string
  type: NotificationType
  title: string
  message: string
  time: string
  read: boolean
  avatar?: string
  businessName?: string
}

// No mock notifications - start with empty state
const mockNotifications: Notification[] = []

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "like":
      return <Heart size={16} weight="fill" className="text-red-500" />
    case "comment":
      return <ChatCircle size={16} weight="fill" className="text-blue-500" />
    case "follow":
      return <UserPlus size={16} weight="fill" className="text-green-500" />
    case "order":
      return <ShoppingBag size={16} weight="fill" className="text-purple-500" />
    case "review":
      return <Star size={16} weight="fill" className="text-yellow-500" />
    case "promotion":
      return <Bell size={16} weight="fill" className="text-primary" />
    default:
      return <Bell size={16} />
  }
}

export function NotificationsView() {
  const [notifications, setNotifications] = useKV<Notification[]>("notifications", mockNotifications)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const notificationsList = notifications || []
  
  const filteredNotifications = notificationsList.filter(notification => 
    filter === "all" || !notification.read
  )

  const unreadCount = notificationsList.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(current => 
      (current || []).map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(current => 
      (current || []).map(notification => ({ ...notification, read: true }))
    )
  }

  return (
    <div className="h-screen bg-background overflow-y-auto">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell size={24} className="text-primary" weight="fill" />
              <h1 className="text-xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={markAllAsRead}
              >
                Mark all read
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All ({notificationsList.length})
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("unread")}
            >
              Unread ({unreadCount})
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 pb-20 space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Bell size={32} className="text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">
              {filter === "unread" ? "No unread notifications" : "No notifications"}
            </h3>
            <p className="text-muted-foreground text-sm">
              {filter === "unread" 
                ? "You're all caught up! Check back later for new updates."
                : "We'll notify you when something interesting happens."
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                !notification.read ? "border-l-4 border-l-primary bg-primary/5" : ""
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {notification.avatar ? (
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={notification.avatar} />
                        <AvatarFallback>
                          {notification.businessName?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{notification.title}</span>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                    
                    <p className="text-sm text-foreground leading-relaxed">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between pt-1">
                      {notification.businessName && (
                        <Badge variant="outline" className="text-xs">
                          {notification.businessName}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">
                        {notification.time}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}