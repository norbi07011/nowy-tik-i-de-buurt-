import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ReviewManagementView() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Zarządzaj opiniami</h1>
        <p className="text-muted-foreground">Manage customer reviews and feedback</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Review Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Review management tools will be displayed here</p>
        </CardContent>
      </Card>
    </div>
  )
}