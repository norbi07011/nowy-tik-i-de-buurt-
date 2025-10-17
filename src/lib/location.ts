export interface GeolocationData {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: number
}

export interface LocationSearchResult {
  name: string
  address: string
  city: string
  postalCode: string
  latitude: number
  longitude: number
  distance?: number
}

export class LocationService {
  private static instance: LocationService
  private currentLocation: GeolocationData | null = null

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService()
    }
    return LocationService.instance
  }

  async getCurrentLocation(): Promise<GeolocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocatie wordt niet ondersteund door uw browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: GeolocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now()
          }
          this.currentLocation = location
          resolve(location)
        },
        (error) => {
          let message = 'Kon uw locatie niet bepalen'
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Toegang tot locatie geweigerd'
              break
            case error.POSITION_UNAVAILABLE:
              message = 'Locatie informatie niet beschikbaar'
              break
            case error.TIMEOUT:
              message = 'Locatie verzoek verlopen'
              break
          }
          reject(new Error(message))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  }

  getCachedLocation(): GeolocationData | null {
    return this.currentLocation
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1)
    const dLon = this.toRadians(lon2 - lon1)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  formatDistance(distance: number): string {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`
    } else if (distance < 10) {
      return `${distance.toFixed(1)}km`
    } else {
      return `${Math.round(distance)}km`
    }
  }

  // Mock geocoding service (in real app would use Google Maps API)
  async geocodeAddress(address: string): Promise<LocationSearchResult[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock results for Dutch addresses
    const mockResults: LocationSearchResult[] = [
      {
        name: address,
        address: `${address}, Amsterdam`,
        city: 'Amsterdam',
        postalCode: '1012 AB',
        latitude: 52.3676 + (Math.random() - 0.5) * 0.1,
        longitude: 4.9041 + (Math.random() - 0.5) * 0.1
      },
      {
        name: address,
        address: `${address}, Utrecht`,
        city: 'Utrecht',
        postalCode: '3511 AB',
        latitude: 52.0907 + (Math.random() - 0.5) * 0.1,
        longitude: 5.1214 + (Math.random() - 0.5) * 0.1
      }
    ]

    return mockResults
  }

  async reverseGeocode(latitude: number, longitude: number): Promise<LocationSearchResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))

    // Mock reverse geocoding result
    return {
      name: 'Huidige locatie',
      address: 'Damrak 1, 1012 LG Amsterdam',
      city: 'Amsterdam',
      postalCode: '1012 LG',
      latitude,
      longitude
    }
  }

  async findNearbyBusinesses(
    latitude: number, 
    longitude: number, 
    radius: number = 5, 
    category?: string
  ): Promise<LocationSearchResult[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Mock nearby businesses
    const businesses: LocationSearchResult[] = [
      {
        name: 'Café Central',
        address: 'Leidseplein 1, Amsterdam',
        city: 'Amsterdam',
        postalCode: '1017 PR',
        latitude: latitude + (Math.random() - 0.5) * 0.01,
        longitude: longitude + (Math.random() - 0.5) * 0.01
      },
      {
        name: 'Restaurant De Kas',
        address: 'Kamerlingh Onneslaan 3, Amsterdam',
        city: 'Amsterdam',
        postalCode: '1097 DE',
        latitude: latitude + (Math.random() - 0.5) * 0.01,
        longitude: longitude + (Math.random() - 0.5) * 0.01
      },
      {
        name: 'Winkel van Sinkel',
        address: 'Oudegracht 158, Utrecht',
        city: 'Utrecht',
        postalCode: '3511 AZ',
        latitude: latitude + (Math.random() - 0.5) * 0.01,
        longitude: longitude + (Math.random() - 0.5) * 0.01
      }
    ]

    // Add distance calculations
    return businesses.map(business => ({
      ...business,
      distance: this.calculateDistance(latitude, longitude, business.latitude, business.longitude)
    })).filter(business => (business.distance || 0) <= radius)
  }

  // Helper to check if location services are available
  isLocationAvailable(): boolean {
    return 'geolocation' in navigator
  }

  // Helper to request location permission
  async requestLocationPermission(): Promise<boolean> {
    if (!this.isLocationAvailable()) {
      return false
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' })
      return result.state === 'granted'
    } catch {
      // Fallback: try to get location directly
      try {
        await this.getCurrentLocation()
        return true
      } catch {
        return false
      }
    }
  }

  // Get location name from coordinates for display
  async getLocationName(latitude: number, longitude: number): Promise<string> {
    try {
      const result = await this.reverseGeocode(latitude, longitude)
      return result.city
    } catch {
      return 'Onbekende locatie'
    }
  }

  // Validate Dutch postal code
  isValidDutchPostalCode(postalCode: string): boolean {
    const regex = /^[1-9][0-9]{3}\s?[A-Z]{2}$/i
    return regex.test(postalCode)
  }

  // Format Dutch postal code consistently
  formatDutchPostalCode(postalCode: string): string {
    const cleaned = postalCode.replace(/\s/g, '').toUpperCase()
    if (cleaned.length === 6) {
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`
    }
    return postalCode
  }

  // Get approximate coordinates for Dutch cities (for demo purposes)
  getCityCoordinates(city: string): { latitude: number; longitude: number } | null {
    const cities: Record<string, { latitude: number; longitude: number }> = {
      'amsterdam': { latitude: 52.3676, longitude: 4.9041 },
      'rotterdam': { latitude: 51.9244, longitude: 4.4777 },
      'den haag': { latitude: 52.0705, longitude: 4.3007 },
      'utrecht': { latitude: 52.0907, longitude: 5.1214 },
      'eindhoven': { latitude: 51.4416, longitude: 5.4697 },
      'groningen': { latitude: 53.2194, longitude: 6.5665 },
      'tilburg': { latitude: 51.5555, longitude: 5.0913 },
      'almere': { latitude: 52.3508, longitude: 5.2647 },
      'breda': { latitude: 51.5719, longitude: 4.7683 },
      'nijmegen': { latitude: 51.8426, longitude: 5.8578 }
    }

    return cities[city.toLowerCase()] || null
  }
}

export const locationService = LocationService.getInstance()