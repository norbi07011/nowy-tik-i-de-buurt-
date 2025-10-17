// File upload utilities
export interface FileUploadResult {
  success: boolean
  url?: string
  error?: string
  fileId?: string
}

export interface UploadProgress {
  fileId: string
  progress: number
  status: 'uploading' | 'processing' | 'complete' | 'error'
}

export class FileUploadService {
  private static instance: FileUploadService
  private uploads = new Map<string, UploadProgress>()

  public static getInstance(): FileUploadService {
    if (!FileUploadService.instance) {
      FileUploadService.instance = new FileUploadService()
    }
    return FileUploadService.instance
  }

  async uploadFile(
    file: File, 
    category: 'business' | 'profile' | 'post' | 'gallery' = 'gallery',
    onProgress?: (progress: UploadProgress) => void
  ): Promise<FileUploadResult> {
    const fileId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Validate file
    const validation = this.validateFile(file)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Initialize progress tracking
    const progressInfo: UploadProgress = {
      fileId,
      progress: 0,
      status: 'uploading'
    }
    this.uploads.set(fileId, progressInfo)

    try {
      // Simulate upload progress
      const updateProgress = (progress: number, status: UploadProgress['status'] = 'uploading') => {
        progressInfo.progress = progress
        progressInfo.status = status
        this.uploads.set(fileId, progressInfo)
        onProgress?.(progressInfo)
      }

      // Simulate upload steps
      updateProgress(10)
      await this.delay(200)
      
      updateProgress(30)
      await this.delay(300)
      
      updateProgress(60)
      await this.delay(400)
      
      updateProgress(80, 'processing')
      await this.delay(500)
      
      // Generate mock URL
      const fileExtension = file.name.split('.').pop()
      const mockUrl = `/uploads/${category}/${fileId}.${fileExtension}`
      
      updateProgress(100, 'complete')
      
      return {
        success: true,
        url: mockUrl,
        fileId
      }
    } catch (error) {
      progressInfo.status = 'error'
      this.uploads.set(fileId, progressInfo)
      return {
        success: false,
        error: 'Upload failed'
      }
    }
  }

  async uploadMultipleFiles(
    files: File[],
    category: 'business' | 'profile' | 'post' | 'gallery' = 'gallery',
    onProgress?: (fileId: string, progress: UploadProgress) => void
  ): Promise<FileUploadResult[]> {
    const uploads = files.map(file => 
      this.uploadFile(file, category, progress => onProgress?.(progress.fileId, progress))
    )
    
    return Promise.all(uploads)
  }

  getUploadProgress(fileId: string): UploadProgress | null {
    return this.uploads.get(fileId) || null
  }

  removeUpload(fileId: string): void {
    this.uploads.delete(fileId)
  }

  private validateFile(file: File): { valid: boolean; error?: string } {
    // Size validation (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return { valid: false, error: 'Bestand is te groot (max 10MB)' }
    }

    // Type validation
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/quicktime',
      'application/pdf', 'text/plain',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Bestandstype niet ondersteund' }
    }

    return { valid: true }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Helper to get file icon based on type
  getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return '🖼️'
      case 'mp4':
      case 'webm':
      case 'mov':
        return '🎥'
      case 'pdf':
        return '📄'
      case 'doc':
      case 'docx':
        return '📝'
      case 'txt':
        return '📋'
      default:
        return '📎'
    }
  }

  // Format file size for display
  formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }
}

// Image processing utilities
export class ImageProcessor {
  static async resizeImage(
    file: File, 
    maxWidth: number = 1200, 
    maxHeight: number = 1200, 
    quality: number = 0.8
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height)
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to create blob'))
          }
        }, 'image/jpeg', quality)
      }

      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
  }

  static async generateThumbnail(file: File, size: number = 200): Promise<Blob> {
    return this.resizeImage(file, size, size, 0.7)
  }

  static extractImageMetadata(file: File): Promise<{ width: number; height: number; size: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          size: file.size
        })
      }
      
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
  }
}

// Content moderation utilities
export class ContentModeration {
  private static bannedWords = [
    // Add inappropriate words here
    'spam', 'scam', 'fake'
  ]

  static moderateText(text: string): { approved: boolean; flaggedWords?: string[] } {
    const words = text.toLowerCase().split(/\s+/)
    const flagged = words.filter(word => this.bannedWords.includes(word))
    
    return {
      approved: flagged.length === 0,
      flaggedWords: flagged.length > 0 ? flagged : undefined
    }
  }

  static async moderateImage(file: File): Promise<{ approved: boolean; confidence?: number }> {
    // Simulate AI content moderation
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock result - in real app would call AI service
    return {
      approved: Math.random() > 0.1, // 90% approval rate
      confidence: Math.random() * 0.3 + 0.7 // 70-100% confidence
    }
  }

  static checkSpamScore(text: string): number {
    let score = 0
    
    // Check for excessive caps
    const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length
    if (capsRatio > 0.5) score += 0.3
    
    // Check for excessive punctuation
    const punctRatio = (text.match(/[!?]{2,}/g) || []).length
    if (punctRatio > 0) score += 0.2
    
    // Check for repeated words
    const words = text.toLowerCase().split(/\s+/)
    const uniqueWords = new Set(words)
    if (words.length / uniqueWords.size > 2) score += 0.2
    
    // Check for URLs
    if (text.match(/https?:\/\//)) score += 0.1
    
    return Math.min(score, 1)
  }
}

// Data backup and export utilities
export class DataExport {
  static async exportBusinessData(businessId: string): Promise<Blob> {
    // Simulate data collection
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const data = {
      businessId,
      exportDate: new Date().toISOString(),
      profile: {}, // Would contain actual business data
      posts: [],
      reviews: [],
      analytics: {},
      campaigns: []
    }
    
    const jsonString = JSON.stringify(data, null, 2)
    return new Blob([jsonString], { type: 'application/json' })
  }

  static async importBusinessData(file: File): Promise<{ success: boolean; error?: string }> {
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      
      // Validate data structure
      if (!data.businessId || !data.exportDate) {
        return { success: false, error: 'Ongeldig bestandsformaat' }
      }
      
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Kon bestand niet lezen' }
    }
  }

  static downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

// Export service instances
export const fileUploadService = FileUploadService.getInstance()