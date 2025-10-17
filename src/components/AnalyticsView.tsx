import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AnalyticsView() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Analityka</h1>
        <p className="text-muted-foreground">Detailed analytics and insights</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Analytics data will be displayed here</p>
        </CardContent>
      </Card>
    </div>
  )
}