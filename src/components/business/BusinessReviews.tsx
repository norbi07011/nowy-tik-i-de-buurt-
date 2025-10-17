import { useState } from "react"
import { useKV } from "@/hooks/use-local-storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Star, MessageSquare, ThumbsUp, Flag, Reply } from "lucide-react"

interface Review {
  id: string
  customerName: string
  rating: number
  comment: string
  date: string
  replied: boolean
  response?: string
  verified: boolean
  source: "google" | "facebook" | "platform"
}

export function BusinessReviews() {
  const [reviews, setReviews] = useKV<Review[]>("business-reviews", [
    {
      id: "1",
      customerName: "Anna Kowalska",
      rating: 5,
      comment: "Świetna obsługa i profesjonalne podejście. Bardzo polecam!",
      date: "2024-01-15",
      replied: true,
      response: "Dziękujemy za miłe słowa! Cieszymy się, że jesteś zadowolona z naszych usług.",
      verified: true,
      source: "google"
    },
    {
      id: "2",
      customerName: "Piotr Nowak",
      rating: 4,
      comment: "Dobra jakość usług, szybka realizacja. Jedyny minus to cena.",
      date: "2024-01-12",
      replied: false,
      verified: true,
      source: "platform"
    },
    {
      id: "3",
      customerName: "Maria Wiśniewska", 
      rating: 5,
      comment: "Najlepsza firma w okolicy! Zawsze terminowo i profesjonalnie.",
      date: "2024-01-10",
      replied: true,
      response: "Bardzo dziękujemy za tak wysoką ocenę!",
      verified: true,
      source: "facebook"
    }
  ])

  const [replyText, setReplyText] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const averageRating = (reviews || []).length > 0 
    ? (reviews || []).reduce((sum, review) => sum + review.rating, 0) / (reviews || []).length 
    : 0

  const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
    rating,
    count: (reviews || []).filter(review => review.rating === rating).length
  }))

  const handleReply = (reviewId: string) => {
    if (!replyText.trim()) return
    
    setReviews(prev => (prev || []).map(review => 
      review.id === reviewId 
        ? { ...review, replied: true, response: replyText }
        : review
    ))
    
    setReplyText("")
    setReplyingTo(null)
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "google": return "G"
      case "facebook": return "F"
      case "platform": return "P"
      default: return "?"
    }
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case "google": return "bg-red-500"
      case "facebook": return "bg-blue-500"
      case "platform": return "bg-primary"
      default: return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Opinie klientów</h2>
          <p className="text-muted-foreground">Zarządzaj opiniami i buduj zaufanie</p>
        </div>
        <Button>
          <MessageSquare className="w-4 h-4 mr-2" />
          Poproś o opinię
        </Button>
      </div>

      {/* Reviews Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">{averageRating.toFixed(1)}</div>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map(star => (
                <Star 
                  key={star} 
                  className={`w-5 h-5 ${star <= averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Średnia ocena ({(reviews || []).length} opinii)</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Rozkład ocen</h3>
            <div className="space-y-2">
              {ratingDistribution.reverse().map(({ rating, count }) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-2">{rating}</span>
                  <Star className="w-4 h-4 text-yellow-400" />
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(reviews || []).length > 0 ? (count / (reviews || []).length) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Statystyki</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Odpowiedzi</span>
                <span className="text-sm font-medium">
                  {(reviews || []).filter(r => r.replied).length}/{(reviews || []).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Zweryfikowane</span>
                <span className="text-sm font-medium">
                  {(reviews || []).filter(r => r.verified).length}/{(reviews || []).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ten miesiąc</span>
                <span className="text-sm font-medium">
                  {(reviews || []).filter(r => new Date(r.date).getMonth() === new Date().getMonth()).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="font-semibold">Wszystkie opinie</h3>
        {(reviews || []).map(review => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    {review.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{review.customerName}</h4>
                      {review.verified && (
                        <Badge variant="outline" className="text-xs">Zweryfikowany</Badge>
                      )}
                      <div className={`w-6 h-6 rounded-full ${getSourceColor(review.source)} flex items-center justify-center text-white text-xs font-bold`}>
                        {getSourceIcon(review.source)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star} 
                          className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Flag className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-muted-foreground mb-4">{review.comment}</p>

              {review.replied && review.response && (
                <div className="bg-muted p-4 rounded-lg mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Reply className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">Odpowiedź właściciela</span>
                  </div>
                  <p className="text-sm">{review.response}</p>
                </div>
              )}

              {!review.replied && (
                <div className="border-t pt-4">
                  {replyingTo === review.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Napisz odpowiedź..."
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleReply(review.id)}
                          disabled={!replyText.trim()}
                        >
                          Wyślij odpowiedź
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            setReplyingTo(null)
                            setReplyText("")
                          }}
                        >
                          Anuluj
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setReplyingTo(review.id)}
                    >
                      <Reply className="w-4 h-4 mr-1" />
                      Odpowiedz
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}