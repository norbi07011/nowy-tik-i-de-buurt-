import { 
  User, 
  PencilSimple, 
  Camera, 
  MapPin, 
  Calendar, 
  Phone, 
  EnvelopeSimple,
  Globe,
  Star,
  Heart,
  Bookmark,
  CreditCard,
  Shield,
  Warning
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useKV } from "@/hooks/use-local-storage"
import { useState } from "react"
import { toast } from "sonner"

type UserProfile = {
  name: string
  email: string
  phone: string
  bio: string
  location: string
  website: string
  joinDate: string
  avatar: string
  verified: boolean
  stats: {
    postsLiked: number
    postsSaved: number
    businessesFollowed: number
    reviewsWritten: number
  }
}

const defaultProfile: UserProfile = {
  name: "John Doe",
  email: "john.doe@example.com", 
  phone: "+31 6 12345678",
  bio: "Local explorer and food enthusiast. Love discovering hidden gems in Amsterdam!",
  location: "Amsterdam, Netherlands",
  website: "https://johndoe.com",
  joinDate: "January 2024",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  verified: true,
  stats: {
    postsLiked: 127,
    postsSaved: 43,
    businessesFollowed: 18,
    reviewsWritten: 9
  }
}

export function AccountView() {
  const [profile, setProfile] = useKV<UserProfile>("user-profile", defaultProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState(defaultProfile)

  const currentProfile = profile || defaultProfile

  const handleEdit = () => {
    setEditForm(currentProfile)
    setIsEditing(true)
  }

  const handleSave = () => {
    setProfile(editForm)
    setIsEditing(false)
    toast.success("Profile updated successfully!")
  }

  const handleCancel = () => {
    setEditForm(currentProfile)
    setIsEditing(false)
  }

  return (
    <div className="h-screen bg-background overflow-y-auto">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User size={24} className="text-primary" weight="fill" />
              <h1 className="text-xl font-bold">Account</h1>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleEdit}
              disabled={isEditing}
            >
              <PencilSimple size={16} className="mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 pb-20 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={currentProfile.avatar} alt={currentProfile.name} />
                  <AvatarFallback className="text-2xl">
                    {currentProfile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="secondary" className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full">
                      <Camera size={14} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Profile Picture</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <Avatar className="w-32 h-32">
                          <AvatarImage src={currentProfile.avatar} />
                          <AvatarFallback>
                            {currentProfile.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <Button className="w-full">
                        <Camera size={16} className="mr-2" />
                        Choose Photo
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="text-center space-y-2">
                <div className="flex items-center gap-2 justify-center">
                  <h2 className="text-2xl font-bold">{currentProfile.name}</h2>
                  {currentProfile.verified && (
                    <Badge variant="secondary" className="text-xs">
                      <Shield size={12} className="mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm max-w-sm">
                  {currentProfile.bio}
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    {currentProfile.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    Joined {currentProfile.joinDate}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="space-y-2">
                <Heart size={24} className="mx-auto text-red-500" weight="fill" />
                <div className="text-2xl font-bold">{currentProfile.stats.postsLiked}</div>
                <div className="text-xs text-muted-foreground">Posts Liked</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="space-y-2">
                <Bookmark size={24} className="mx-auto text-warning" weight="fill" />
                <div className="text-2xl font-bold">{currentProfile.stats.postsSaved}</div>
                <div className="text-xs text-muted-foreground">Posts Saved</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="space-y-2">
                <User size={24} className="mx-auto text-blue-500" weight="fill" />
                <div className="text-2xl font-bold">{currentProfile.stats.businessesFollowed}</div>
                <div className="text-xs text-muted-foreground">Following</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="space-y-2">
                <Star size={24} className="mx-auto text-yellow-500" weight="fill" />
                <div className="text-2xl font-bold">{currentProfile.stats.reviewsWritten}</div>
                <div className="text-xs text-muted-foreground">Reviews</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={editForm.phone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio</label>
                  <Textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={editForm.location}
                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Your city, country"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Website</label>
                  <Input
                    value={editForm.website}
                    onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} className="flex-1">
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancel} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <EnvelopeSimple size={16} className="text-muted-foreground" />
                  <span className="text-sm">{currentProfile.email}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-muted-foreground" />
                  <span className="text-sm">{currentProfile.phone}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-muted-foreground" />
                  <span className="text-sm">{currentProfile.location}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Globe size={16} className="text-muted-foreground" />
                  <a href={currentProfile.website} className="text-sm text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    {currentProfile.website}
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <CreditCard size={16} className="mr-2" />
              Payment Methods
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Shield size={16} className="mr-2" />
              Privacy Settings
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <User size={16} className="mr-2" />
              Account Verification
            </Button>
            
            <Separator />
            
            <Button variant="outline" className="w-full justify-start text-orange-600 hover:text-orange-700">
              <Warning size={16} className="mr-2" />
              Deactivate Account
            </Button>
            
            <Button variant="destructive" className="w-full justify-start">
              <Warning size={16} className="mr-2" />
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}