import { useKV } from "@/hooks/use-local-storage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Bell, Heart, ChatCircle, Building, Tag, CheckCircle } from "@phosphor-icons/react"

interface UserNotificationsViewProps {
  user: any
}

interface Notification {
  id: string
  type: 'like' | 'message' | 'offer' | 'system'
  title: string
  description: string
  timestamp: string
  read: boolean
  avatar?: string
  businessName?: string
}

export function UserNotificationsView({ user }: UserNotificationsViewProps) {
  const [notifications, setNotifications] = useKV<Notification[]>("user-notifications", [
    {
      id: "1",
      type: "offer",
      title: "Nowa promocja w Twojej okolicy",
      description: "Pizza Mama ma nową ofertę -30% na wszystkie pizze",
      timestamp: "2 min temu",
      read: false,
      avatar: "/api/placeholder/40/40",
      businessName: "Pizza Mama"
    },
    {
      id: "2", 
      type: "message",
      title: "Nowa wiadomość",
      description: "Restauracja Bella Vita odpowiedziała na Twoje zapytanie",
      timestamp: "1 godzinę temu",
      read: false,
      avatar: "/api/placeholder/40/40",
      businessName: "Bella Vita"
    },
    {
      id: "3",
      type: "system",
      title: "Aktualizacja aplikacji",
      description: "Dodaliśmy nowe funkcje do przeglądania ofert",
      timestamp: "3 godziny temu", 
      read: true
    },
    {
      id: "4",
      type: "offer",
      title: "Weekend Sale",
      description: "Tech Store ma wyprzedaż elektroniki na weekend",
      timestamp: "1 dzień temu",
      read: true,
      avatar: "/api/placeholder/40/40",
      businessName: "Tech Store"
    }
  ])

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      (prev || []).map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      (prev || []).map(notif => ({ ...notif, read: true }))
    )
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      (prev || []).filter(notif => notif.id !== notificationId)
    )
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart size={20} className="text-red-500" />
      case 'message':
        return <ChatCircle size={20} className="text-blue-500" />
      case 'offer':
        return <Tag size={20} className="text-green-500" />
      case 'system':
        return <Bell size={20} className="text-gray-500" />
      default:
        return <Bell size={20} className="text-gray-500" />
    }
  }

  const unreadCount = (notifications || []).filter(n => !n.read).length

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Powiadomienia</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive">
              {unreadCount} nowych
            </Badge>
          )}
        </div>
        
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCircle size={16} className="mr-2" />
            Oznacz wszystkie jako przeczytane
          </Button>
        )}
      </div>

      {(notifications || []).length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Bell size={64} className="mx-auto text-muted-foreground mb-4" />
            <CardTitle className="mb-2">Brak powiadomień</CardTitle>
            <CardDescription>
              Tutaj zobaczysz wszystkie swoje powiadomienia
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {(notifications || []).map((notification, index) => (
            <Card 
              key={notification.id}
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                !notification.read ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Notification Icon or Avatar */}
                  <div className="flex-shrink-0">
                    {notification.avatar ? (
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={notification.avatar} />
                        <AvatarFallback>
                          <Building size={20} />
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className={`font-medium ${!notification.read ? 'text-primary' : ''}`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.description}
                        </p>
                        {notification.businessName && (
                          <p className="text-xs text-muted-foreground mt-1">
                            od {notification.businessName}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {notification.timestamp}
                        </span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNotification(notification.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {(notifications || []).length > 0 && (
        <div className="text-center">
          <Button variant="outline" size="sm">
            Załaduj więcej
          </Button>
        </div>
      )}
    </div>
  )
}