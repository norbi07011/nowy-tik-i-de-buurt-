import { useState } from "react"
import { useKV } from "@/hooks/use-local-storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChatCircleText, User, Star, ArrowBendUpLeft, Trash, CheckCircle, Clock } from "@phosphor-icons/react"
import { toast } from "sonner"

interface Review {
  id: string
  authorName: string
  authorAvatar?: string
  rating: number
  comment: string
  date: string
  status: 'published' | 'pending' | 'hidden'
  businessResponse?: string
  responseDate?: string
}

interface CustomerMessage {
  id: string
  customerName: string
  customerEmail: string
  subject: string
  message: string
  date: string
  status: 'new' | 'replied' | 'closed'
  priority: 'low' | 'medium' | 'high'
  response?: string
  responseDate?: string
}

export function CustomerEngagement({ businessId }: { businessId: string }) {
  const [reviews, setReviews] = useKV<Review[]>(`reviews-${businessId}`, [
    {
      id: '1',
      authorName: 'Anna Kowalska',
      rating: 5,
      comment: 'Fantastyczna obsługa i świetne produkty! Polecam każdemu.',
      date: '2024-03-10',
      status: 'published'
    },
    {
      id: '2',
      authorName: 'Marek Nowak',
      rating: 4,
      comment: 'Bardzo dobra jakość, szybka dostawa. Jedna gwiazdka mniej za cenę.',
      date: '2024-03-08',
      status: 'published',
      businessResponse: 'Dziękujemy za opinię! Staramy się oferować najlepszą jakość w konkurencyjnych cenach.',
      responseDate: '2024-03-09'
    },
    {
      id: '3',
      authorName: 'Katarzyna Zielińska',
      rating: 3,
      comment: 'Przeciętne doświadczenie. Oczekiwałam więcej.',
      date: '2024-03-05',
      status: 'pending'
    }
  ])

  const [messages, setMessages] = useKV<CustomerMessage[]>(`messages-${businessId}`, [
    {
      id: '1',
      customerName: 'Jan Kowalski',
      customerEmail: 'jan@example.com',
      subject: 'Pytanie o dostępność produktu',
      message: 'Czy produkt X jest obecnie dostępny? Interesuje mnie zakup 5 sztuk.',
      date: '2024-03-12',
      status: 'new',
      priority: 'medium'
    },
    {
      id: '2',
      customerName: 'Maria Nowak',
      customerEmail: 'maria@example.com',
      subject: 'Problem z zamówieniem',
      message: 'Moje zamówienie #123 nie zostało dostarczone w terminie. Proszę o informację.',
      date: '2024-03-11',
      status: 'replied',
      priority: 'high',
      response: 'Przepraszamy za opóźnienie. Sprawdziliśmy status Państwa zamówienia i zostanie dostarczone jutro.',
      responseDate: '2024-03-11'
    }
  ])

  const [showReplyDialog, setShowReplyDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Review | CustomerMessage | null>(null)
  const [replyText, setReplyText] = useState('')

  const handleReplyToReview = (review: Review) => {
    setSelectedItem(review)
    setReplyText('')
    setShowReplyDialog(true)
  }

  const handleReplyToMessage = (message: CustomerMessage) => {
    setSelectedItem(message)
    setReplyText('')
    setShowReplyDialog(true)
  }

  const handleSendReply = () => {
    if (!selectedItem || !replyText.trim()) return

    if ('rating' in selectedItem) {
      // It's a review
      setReviews(current => 
        (current || []).map(review => 
          review.id === selectedItem.id 
            ? { 
                ...review, 
                businessResponse: replyText,
                responseDate: new Date().toISOString().split('T')[0],
                status: 'published' as const
              }
            : review
        )
      )
    } else {
      // It's a message
      setMessages(current => 
        (current || []).map(message => 
          message.id === selectedItem.id 
            ? { 
                ...message, 
                response: replyText,
                responseDate: new Date().toISOString().split('T')[0],
                status: 'replied' as const
              }
            : message
        )
      )
    }

    setShowReplyDialog(false)
    setSelectedItem(null)
    setReplyText('')
    toast.success("Odpowiedź została wysłana")
  }

  const handleUpdateReviewStatus = (reviewId: string, status: Review['status']) => {
    setReviews(current => 
      (current || []).map(review => 
        review.id === reviewId ? { ...review, status } : review
      )
    )
    toast.success("Status opinii został zaktualizowany")
  }

  const handleDeleteReview = (reviewId: string) => {
    setReviews(current => (current || []).filter(review => review.id !== reviewId))
    toast.success("Opinia została usunięta")
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Opublikowana</Badge>
      case 'pending':
        return <Badge variant="secondary">Oczekująca</Badge>
      case 'hidden':
        return <Badge variant="outline">Ukryta</Badge>
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800">Nowa</Badge>
      case 'replied':
        return <Badge className="bg-green-100 text-green-800">Odpowiedziano</Badge>
      case 'closed':
        return <Badge variant="outline">Zamknięta</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: CustomerMessage['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">Wysoki</Badge>
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Średni</Badge>
      case 'low':
        return <Badge variant="secondary">Niski</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const averageRating = (reviews || []).reduce((sum, review) => sum + review.rating, 0) / (reviews?.length || 1)
  const newMessagesCount = (messages || []).filter(m => m.status === 'new').length
  const pendingReviewsCount = (reviews || []).filter(r => r.status === 'pending').length

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Średnia ocena</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
                  <div className="flex">
                    {renderStars(Math.round(averageRating))}
                  </div>
                </div>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Nowe wiadomości</p>
                <p className="text-2xl font-bold">{newMessagesCount}</p>
              </div>
              <ChatCircleText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Oczekujące opinie</p>
                <p className="text-2xl font-bold">{pendingReviewsCount}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reviews" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reviews">Opinie klientów</TabsTrigger>
          <TabsTrigger value="messages">Wiadomości</TabsTrigger>
          <TabsTrigger value="analytics">Analityka</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Opinie Klientów
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Autor</TableHead>
                    <TableHead>Ocena</TableHead>
                    <TableHead>Komentarz</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(reviews || []).map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">{review.authorName}</TableCell>
                      <TableCell>
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{review.comment}</TableCell>
                      <TableCell>{getStatusBadge(review.status)}</TableCell>
                      <TableCell>{review.date}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {!review.businessResponse && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleReplyToReview(review)}
                            >
                              <ArrowBendUpLeft className="h-4 w-4" />
                            </Button>
                          )}
                          {review.status === 'pending' && (
                            <Button 
                              size="sm"
                              onClick={() => handleUpdateReviewStatus(review.id, 'published')}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleDeleteReview(review.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChatCircleText className="h-5 w-5" />
                Wiadomości od Klientów
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Klient</TableHead>
                    <TableHead>Temat</TableHead>
                    <TableHead>Priorytet</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(messages || []).map((message) => (
                    <TableRow key={message.id}>
                      <TableCell className="font-medium">{message.customerName}</TableCell>
                      <TableCell>{message.subject}</TableCell>
                      <TableCell>{getPriorityBadge(message.priority)}</TableCell>
                      <TableCell>{getStatusBadge(message.status)}</TableCell>
                      <TableCell>{message.date}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {message.status === 'new' && (
                            <Button 
                              size="sm"
                              onClick={() => handleReplyToMessage(message)}
                            >
                              Odpowiedz
                            </Button>
                          )}
                          {message.status === 'replied' && (
                            <Badge variant="outline" className="text-xs">
                              Odpowiedziano
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analityka Zaangażowania</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Szczegółowe analizy zaangażowania klientów będą dostępne wkrótce.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reply Dialog */}
      <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {'rating' in (selectedItem || {}) ? 'Odpowiedź na opinię' : 'Odpowiedź na wiadomość'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedItem && (
              <div className="p-4 bg-muted rounded-lg">
                {'rating' in selectedItem ? (
                  <div>
                    <p className="font-medium">{selectedItem.authorName}</p>
                    <div className="flex mb-2">
                      {renderStars(selectedItem.rating)}
                    </div>
                    <p className="text-sm">{selectedItem.comment}</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium">{selectedItem.customerName}</p>
                    <p className="text-sm font-medium">{selectedItem.subject}</p>
                    <p className="text-sm mt-2">{selectedItem.message}</p>
                  </div>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="reply">Twoja odpowiedź</Label>
              <Textarea
                id="reply"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Napisz swoją odpowiedź..."
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowReplyDialog(false)}>
                Anuluj
              </Button>
              <Button onClick={handleSendReply}>
                Wyślij odpowiedź
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}