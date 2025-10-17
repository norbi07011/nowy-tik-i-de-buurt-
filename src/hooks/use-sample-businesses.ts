import { useKV } from "@/hooks/use-local-storage"
import { BusinessProfile } from "@/types"

export function useSampleBusinesses() {
  const [favoriteBusinesses, setFavoriteBusinesses] = useKV<BusinessProfile[]>("user-favorite-businesses", [
    {
      id: "1",
      userId: "business-1",
      businessName: "Café Amsterdam",
      description: "Przytulna kawiarnia w sercu Amsterdamu z najlepszą kawą w mieście",
      category: "restaurant",
      contactInfo: {
        email: "info@cafeamsterdam.nl",
        phone: "+31 20 123 4567",
        website: "https://cafeamsterdam.nl"
      },
      location: {
        address: "Damrak 123",
        city: "Amsterdam",
        postalCode: "1012 AB",
        country: "Netherlands",
        coordinates: {
          lat: 52.3676,
          lng: 4.9041
        }
      },
      operatingHours: {
        monday: { isOpen: true, openTime: "07:00", closeTime: "18:00" },
        tuesday: { isOpen: true, openTime: "07:00", closeTime: "18:00" },
        wednesday: { isOpen: true, openTime: "07:00", closeTime: "18:00" },
        thursday: { isOpen: true, openTime: "07:00", closeTime: "18:00" },
        friday: { isOpen: true, openTime: "07:00", closeTime: "20:00" },
        saturday: { isOpen: true, openTime: "08:00", closeTime: "20:00" },
        sunday: { isOpen: true, openTime: "09:00", closeTime: "17:00" }
      },
      socialMedia: {
        instagram: "https://instagram.com/cafeamsterdam",
        facebook: "https://facebook.com/cafeamsterdam"
      },
      gallery: [
        {
          id: "img1",
          url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop",
          type: "image",
          title: "Interior",
          description: "Cozy interior",
          uploadedAt: "2024-01-01T00:00:00Z",
          size: 150000,
          mimeType: "image/jpeg"
        }
      ],
      verified: true,
      rating: 4.8,
      reviewCount: 127,
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "2",
      userId: "business-2",
      businessName: "Studio Yoga Zen",
      description: "Spokojne studio jogi oferujące różnorodne zajęcia dla wszystkich poziomów",
      category: "fitness",
      contactInfo: {
        email: "hello@yogazen.nl",
        phone: "+31 20 987 6543",
        website: "https://yogazen.nl"
      },
      location: {
        address: "Vondelpark 45",
        city: "Amsterdam",
        postalCode: "1071 AA",
        country: "Netherlands",
        coordinates: {
          lat: 52.3584,
          lng: 4.8692
        }
      },
      operatingHours: {
        monday: { isOpen: true, openTime: "06:00", closeTime: "22:00" },
        tuesday: { isOpen: true, openTime: "06:00", closeTime: "22:00" },
        wednesday: { isOpen: true, openTime: "06:00", closeTime: "22:00" },
        thursday: { isOpen: true, openTime: "06:00", closeTime: "22:00" },
        friday: { isOpen: true, openTime: "06:00", closeTime: "21:00" },
        saturday: { isOpen: true, openTime: "08:00", closeTime: "18:00" },
        sunday: { isOpen: true, openTime: "09:00", closeTime: "17:00" }
      },
      socialMedia: {
        instagram: "https://instagram.com/yogazenamsterdam"
      },
      gallery: [
        {
          id: "img2",
          url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
          type: "image",
          title: "Yoga Class",
          description: "Morning yoga session",
          uploadedAt: "2024-01-01T00:00:00Z",
          size: 180000,
          mimeType: "image/jpeg"
        }
      ],
      verified: true,
      rating: 4.9,
      reviewCount: 89,
      createdAt: "2023-02-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "3",
      userId: "business-3",
      businessName: "Fryzjer Stylowy",
      description: "Nowoczesny salon fryzjerski z doświadczonymi stylistami",
      category: "beauty",
      contactInfo: {
        email: "booking@fryzjerstylowy.nl",
        phone: "+31 20 555 1234"
      },
      location: {
        address: "Jordaan 78",
        city: "Amsterdam",
        postalCode: "1016 DK",
        country: "Netherlands",
        coordinates: {
          lat: 52.3738,
          lng: 4.8834
        }
      },
      operatingHours: {
        monday: { isOpen: false },
        tuesday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
        wednesday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
        thursday: { isOpen: true, openTime: "09:00", closeTime: "20:00" },
        friday: { isOpen: true, openTime: "09:00", closeTime: "20:00" },
        saturday: { isOpen: true, openTime: "08:00", closeTime: "17:00" },
        sunday: { isOpen: true, openTime: "10:00", closeTime: "16:00" }
      },
      socialMedia: {
        instagram: "https://instagram.com/fryzjerstylowy"
      },
      gallery: [
        {
          id: "img3",
          url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
          type: "image",
          title: "Salon Interior",
          description: "Modern salon space",
          uploadedAt: "2024-01-01T00:00:00Z",
          size: 200000,
          mimeType: "image/jpeg"
        }
      ],
      verified: true,
      rating: 4.6,
      reviewCount: 156,
      createdAt: "2023-03-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    }
  ])

  return { favoriteBusinesses, setFavoriteBusinesses }
}