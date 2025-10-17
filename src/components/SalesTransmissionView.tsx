import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SalesTransmissionView() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Transmisja sprzedaży</h1>
        <p className="text-muted-foreground">Live sales transmission and broadcasting</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Sales Transmission</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Sales broadcasting tools will be displayed here</p>
        </CardContent>
      </Card>
    </div>
  )
}