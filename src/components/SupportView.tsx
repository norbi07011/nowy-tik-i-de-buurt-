import { 
  Question, 
  ChatCircle, 
  EnvelopeSimple, 
  Phone, 
  BookOpen, 
  Bug, 
  Lightbulb, 
  Heart,
  Star,
  Warning,
  ClockClockwise,
  CheckCircle,
  Globe
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useKV } from "@github/spark/hooks"
import { useState } from "react"
import { toast } from "sonner"

type SupportTicket = {
  id: string
  subject: string
  category: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  message: string
  createdAt: string
  updatedAt: string
}

type FAQ = {
  id: string
  question: string
  answer: string
  category: string
  helpful: number
}

const faqs: FAQ[] = [
  {
    id: "1",
    question: "How do I create a business profile?",
    answer: "To create a business profile, go to 'My Business' in the admin dashboard and click 'Create Profile'. Fill in your business details, upload photos, and submit for review.",
    category: "Business",
    helpful: 24
  },
  {
    id: "2", 
    question: "How can I promote my business posts?",
    answer: "You can promote posts through our Marketing Services. Visit the Marketing section to create campaigns, boost posts, and reach more local customers.",
    category: "Marketing",
    helpful: 18
  },
  {
    id: "3",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, iDEAL, and bank transfers. You can manage your payment methods in Account Settings.",
    category: "Billing",
    helpful: 15
  },
  {
    id: "4",
    question: "How do I respond to customer reviews?",
    answer: "Go to 'Manage Reviews' in your dashboard. You can respond to reviews, thank customers, and address any concerns professionally.",
    category: "Reviews",
    helpful: 12
  },
  {
    id: "5",
    question: "Can I schedule posts in advance?",
    answer: "Yes! When creating a post, you can select a future date and time for automatic publishing. This feature is available in the Create Post section.",
    category: "Posts",
    helpful: 21
  }
]

export function SupportView() {
  const [tickets, setTickets] = useKV<SupportTicket[]>("support-tickets", [])
  const [showCreateTicket, setShowCreateTicket] = useState(false)
  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "",
    priority: "medium" as const,
    message: ""
  })
  const [selectedFAQCategory, setSelectedFAQCategory] = useState("all")

  const ticketsList = tickets || []
  const faqCategories = ["all", ...Array.from(new Set(faqs.map(faq => faq.category)))]
  const filteredFAQs = selectedFAQCategory === "all" 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedFAQCategory)

  const createTicket = () => {
    if (!newTicket.subject.trim() || !newTicket.message.trim() || !newTicket.category) {
      toast.error("Please fill in all required fields")
      return
    }

    const ticket: SupportTicket = {
      id: Date.now().toString(),
      subject: newTicket.subject,
      category: newTicket.category,
      status: "open",
      priority: newTicket.priority,
      message: newTicket.message,
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleDateString()
    }

    setTickets(current => [ticket, ...(current || [])])
    setNewTicket({ subject: "", category: "", priority: "medium", message: "" })
    setShowCreateTicket(false)
    toast.success("Support ticket created successfully!")
  }

  const getStatusColor = (status: SupportTicket["status"]) => {
    switch (status) {
      case "open": return "destructive"
      case "in-progress": return "default"
      case "resolved": return "secondary"
      case "closed": return "outline"
      default: return "outline"
    }
  }

  const getPriorityColor = (priority: SupportTicket["priority"]) => {
    switch (priority) {
      case "urgent": return "text-red-600"
      case "high": return "text-orange-600"
      case "medium": return "text-yellow-600"
      case "low": return "text-green-600"
      default: return "text-gray-600"
    }
  }

  return (
    <div className="h-screen bg-background overflow-y-auto">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Question size={24} className="text-primary" weight="fill" />
              <h1 className="text-xl font-bold">Help & Support</h1>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowCreateTicket(!showCreateTicket)}
            >
              <ChatCircle size={16} className="mr-2" />
              Contact Support
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 pb-20 space-y-6">
        {/* Quick Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="space-y-2">
                <ChatCircle size={32} className="mx-auto text-blue-500" weight="fill" />
                <h3 className="font-semibold">Live Chat</h3>
                <p className="text-xs text-muted-foreground">Get instant help from our team</p>
                <Badge variant="secondary" className="text-xs">Online now</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="space-y-2">
                <EnvelopeSimple size={32} className="mx-auto text-green-500" weight="fill" />
                <h3 className="font-semibold">Email Support</h3>
                <p className="text-xs text-muted-foreground">support@tikindebuurt.nl</p>
                <Badge variant="outline" className="text-xs">24h response</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="space-y-2">
                <Phone size={32} className="mx-auto text-purple-500" weight="fill" />
                <h3 className="font-semibold">Phone Support</h3>
                <p className="text-xs text-muted-foreground">+31 20 123 4567</p>
                <Badge variant="outline" className="text-xs">Mon-Fri 9-17</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Support Ticket */}
        {showCreateTicket && (
          <Card>
            <CardHeader>
              <CardTitle>Create Support Ticket</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category *</label>
                  <Select
                    value={newTicket.category}
                    onValueChange={(value) => setNewTicket(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="billing">Billing & Payments</SelectItem>
                      <SelectItem value="business">Business Profile</SelectItem>
                      <SelectItem value="marketing">Marketing & Promotion</SelectItem>
                      <SelectItem value="account">Account Management</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select
                    value={newTicket.priority}
                    onValueChange={(value: any) => setNewTicket(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Subject *</label>
                <Input
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Brief description of your issue"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message *</label>
                <Textarea
                  value={newTicket.message}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Please provide detailed information about your issue..."
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={createTicket} className="flex-1">
                  Create Ticket
                </Button>
                <Button variant="outline" onClick={() => setShowCreateTicket(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* My Support Tickets */}
        {ticketsList.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>My Support Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ticketsList.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold">{ticket.subject}</h4>
                        <p className="text-sm text-muted-foreground">
                          {ticket.category} • Created {ticket.createdAt}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                        <span className={`text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm">{ticket.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen size={20} />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {faqCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedFAQCategory === category ? "default" : "outline"}
                  size="sm"
                  className="whitespace-nowrap"
                  onClick={() => setSelectedFAQCategory(category)}
                >
                  {category === "all" ? "All" : category}
                </Button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredFAQs.map((faq) => (
                <div key={faq.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold">{faq.question}</h4>
                    <Badge variant="outline" className="text-xs">
                      {faq.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Heart size={12} />
                      <span>{faq.helpful} people found this helpful</span>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        Helpful
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        Not helpful
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <BookOpen size={16} className="mr-2" />
              User Guide & Tutorials
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Bug size={16} className="mr-2" />
              Report a Bug
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Lightbulb size={16} className="mr-2" />
              Feature Requests
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Globe size={16} className="mr-2" />
              Community Forum
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Star size={16} className="mr-2" />
              Rate Our App
            </Button>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto">
                <Question size={24} className="text-primary-foreground" weight="fill" />
              </div>
              <div>
                <h3 className="font-semibold">Still need help?</h3>
                <p className="text-sm text-muted-foreground">
                  Our support team is here to help you succeed
                </p>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Email: support@tikindebuurt.nl</p>
                <p>Phone: +31 20 123 4567</p>
                <p>Hours: Monday - Friday, 9:00 - 17:00 CET</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}