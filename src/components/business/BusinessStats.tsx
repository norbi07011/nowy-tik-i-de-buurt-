import { useKV } from "@github/spark/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, Users, Eye, MessageSquare, Star, Calendar, TrendingDown, Target } from "lucide-react"

export function BusinessStats() {
  const [analytics] = useKV("business-analytics", {
    views: {
      total: 1247,
      thisMonth: 234,
      growth: 23.5
    },
    contacts: {
      total: 89,
      thisMonth: 15,
      growth: 12.3
    },
    reviews: {
      total: 42,
      average: 4.8,
      growth: 8.7
    },
    monthlyData: [
      { month: "Sty", views: 120, contacts: 8, reviews: 3 },
      { month: "Lut", views: 135, contacts: 12, reviews: 5 },
      { month: "Mar", views: 165, contacts: 15, reviews: 4 },
      { month: "Kwi", views: 189, contacts: 18, reviews: 6 },
      { month: "Maj", views: 220, contacts: 22, reviews: 8 },
      { month: "Cze", views: 234, contacts: 15, reviews: 7 }
    ],
    categories: [
      { name: "Strona główna", visits: 45, color: "#8B5CF6" },
      { name: "Galeria", visits: 25, color: "#10B981" },
      { name: "Kontakt", visits: 20, color: "#F59E0B" },
      { name: "Portfolio", visits: 10, color: "#EF4444" }
    ]
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Statystyki biznesowe</h2>
        <p className="text-muted-foreground">Monitoruj rozwój swojej firmy na platformie</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Wyświetlenia</p>
                <div className="flex items-center">
                  <div className="text-2xl font-bold">{analytics?.views.total}</div>
                  <div className="ml-2 text-sm text-green-600">+{analytics?.views.growth}%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Kontakty</p>
                <div className="flex items-center">
                  <div className="text-2xl font-bold">{analytics?.contacts.total}</div>
                  <div className="ml-2 text-sm text-green-600">+{analytics?.contacts.growth}%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="w-8 h-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Opinie</p>
                <div className="flex items-center">
                  <div className="text-2xl font-bold">{analytics?.reviews.total}</div>
                  <div className="ml-2 text-sm text-green-600">+{analytics?.reviews.growth}%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Ocena</p>
                <div className="flex items-center">
                  <div className="text-2xl font-bold">{analytics?.reviews.average}</div>
                  <div className="ml-2 text-sm text-yellow-600">★</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Trendy miesięczne</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics?.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Line type="monotone" dataKey="views" stroke="#8B5CF6" strokeWidth={2} />
                <Line type="monotone" dataKey="contacts" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Popularne sekcje</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics?.categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="visits"
                >
                  {analytics?.categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {analytics?.categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm">{category.name}</span>
                  </div>
                  <span className="text-sm font-medium">{category.visits}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Wnioski i rekomendacje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center mb-2">
                <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                <h4 className="font-medium">Wzrost popularności</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Twoja firma notuje stały wzrost wyświetleń. Kontynuuj regularne publikowanie treści.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center mb-2">
                <Target className="w-5 h-5 text-blue-500 mr-2" />
                <h4 className="font-medium">Konwersja kontaktów</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Współczynnik konwersji to 7.1%. Rozważ optymalizację formularza kontaktowego.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center mb-2">
                <Calendar className="w-5 h-5 text-purple-500 mr-2" />
                <h4 className="font-medium">Najlepsze dni</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Najwięcej aktywności w środy i piątki. Planuj promocje na te dni.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}