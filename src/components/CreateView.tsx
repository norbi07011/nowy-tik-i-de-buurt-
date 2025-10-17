import { Camera, Image, TextT, MapPin } from "@phosphor-icons/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const categories = [
  "Restaurant", "Bakery", "Florist", "Fashion", "Electronics", "Sports", 
  "Bookstore", "Garden Center", "Art Gallery", "Crafts", "Service", "Health"
]

export function CreateView() {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [businessName, setBusinessName] = useState("")

  const handleCreatePost = () => {
    if (!businessName.trim() || !title.trim() || !description.trim() || !selectedCategory || !location.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    toast.success("Post created successfully!")
    
    setBusinessName("")
    setTitle("")
    setDescription("")
    setLocation("")
    setSelectedCategory("")
  }

  return (
    <div className="h-screen bg-background overflow-y-auto pb-20">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="p-4">
          <div className="flex items-center gap-2">
            <Camera size={24} className="text-primary" weight="fill" />
            <h1 className="text-xl font-bold">Create Post</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Card className="border-dashed border-2 border-muted-foreground/25 bg-muted/50">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Image size={32} className="text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Add Photos</h3>
                <p className="text-sm text-muted-foreground">
                  Upload images to showcase your business
                </p>
              </div>
              <Button>
                <Camera size={16} className="mr-2" />
                Choose Photos
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TextT size={20} />
              Post Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Business Name *</label>
              <Input
                placeholder="Enter your business name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Post Title *</label>
              <Input
                placeholder="What's special about your offering?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                placeholder="Tell customers about your product, service, or special offer..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="text-xs text-muted-foreground text-right">
                {description.length}/280
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category *</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location *</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your business location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="icon">
                  <MapPin size={16} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button 
            onClick={handleCreatePost}
            className="w-full"
            size="lg"
          >
            Create Post
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            By creating a post, you agree to our Terms of Service and Community Guidelines
          </p>
        </div>
      </div>
    </div>
  )
}