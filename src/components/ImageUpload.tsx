import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface ImageUploadProps {
  productId?: string
  onImagesUploaded: (imageUrls: string[]) => void
  existingImages?: string[]
  onPendingImagesChange?: (pendingImages: File[]) => void
  onUploadPendingImages?: (uploadFn: () => Promise<string[]>) => void
}

interface UploadedImage {
  id: string
  url: string
  file: File
  uploading: boolean
  isPending: boolean
}

export default function ImageUpload({ productId, onImagesUploaded, existingImages = [], onPendingImagesChange, onUploadPendingImages }: ImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadImage = async (file: File): Promise<string> => {
    if (!productId) {
      throw new Error('Product ID is required for image upload')
    }
    
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${productId}/${fileName}`

    const { error: uploadError, data } = await supabase.storage
      .from('productimages')
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data: { publicUrl } } = supabase.storage
      .from('productimages')
      .getPublicUrl(filePath)

    return publicUrl
  }

  const handleFileUpload = async (files: FileList) => {
    const newImages: UploadedImage[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`)
        continue
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB`)
        continue
      }

      const tempId = Math.random().toString(36).substring(2)
      const newImage: UploadedImage = {
        id: tempId,
        url: URL.createObjectURL(file), // for preview only
        file,
        uploading: false,
        isPending: true
      }

      newImages.push(newImage)
    }

    setUploadedImages(prev => [...prev, ...newImages])
    
    // Notify parent about pending images
    if (onPendingImagesChange) {
      const allPendingFiles = [...uploadedImages, ...newImages]
        .filter(img => img.isPending)
        .map(img => img.file)
      onPendingImagesChange(allPendingFiles)
    }

    // Only pass existing images to parent - pending images will be handled separately
    onImagesUploaded(existingImages)
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }, [])

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files)
    }
  }

  const removeImage = (imageId: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId))
    
    // Update pending images
    if (onPendingImagesChange) {
      const remainingPendingFiles = uploadedImages
        .filter(img => img.id !== imageId && img.isPending)
        .map(img => img.file)
      onPendingImagesChange(remainingPendingFiles)
    }
  }

  // Function to upload pending images (called from parent)
  const uploadPendingImages = useCallback(async (): Promise<string[]> => {
    const pendingImages = uploadedImages.filter(img => img.isPending)
    if (pendingImages.length === 0) {
      return existingImages
    }

    setUploading(true)
    const uploadedUrls: string[] = []

    for (const image of pendingImages) {
      try {
        // Mark as uploading
        setUploadedImages(prev => prev.map(img => 
          img.id === image.id 
            ? { ...img, uploading: true }
            : img
        ))

        const publicUrl = await uploadImage(image.file)
        uploadedUrls.push(publicUrl)
        
        // Mark as uploaded
        setUploadedImages(prev => prev.map(img => 
          img.id === image.id 
            ? { ...img, url: publicUrl, uploading: false, isPending: false }
            : img
        ))
      } catch (error) {
        console.error('Error uploading image:', error)
        setUploadedImages(prev => prev.filter(img => img.id !== image.id))
        alert(`Failed to upload ${image.file.name}`)
      }
    }

    setUploading(false)
    return [...existingImages, ...uploadedUrls]
  }, [uploadedImages, existingImages])

  // Expose uploadPendingImages function to parent
  useEffect(() => {
    if (onUploadPendingImages) {
      onUploadPendingImages(uploadPendingImages)
    }
  }, [onUploadPendingImages, uploadPendingImages])

  return (
    <div className="space-y-4">
      {/* Drag and Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver
            ? 'border-emerald-500 bg-emerald-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <div className="space-y-2">
          <p className="font-heading text-lg font-medium text-gray-900">
            Drop images here or click to upload
          </p>
          <p className="font-body text-sm text-gray-500">
            PNG, JPG, GIF up to 5MB each
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="mt-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-heading font-medium transition-colors duration-200"
          >
            {uploading ? 'Uploading...' : 'Choose Files'}
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Uploaded Images Preview */}
      {uploadedImages.length > 0 && (
        <div>
          <h4 className="font-heading text-sm font-medium text-gray-900 mb-3">
            Images ({uploadedImages.length})
            {uploadedImages.some(img => img.isPending) && (
              <span className="ml-2 text-sm text-orange-600 font-body">
                (Pending upload)
              </span>
            )}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {image.uploading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                    </div>
                  ) : (
                    <img
                      src={image.url}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
                {image.uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <div className="text-white text-sm font-body">Uploading...</div>
                  </div>
                )}
                {image.isPending && !image.uploading && (
                  <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    Pending
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div>
          <h4 className="font-heading text-sm font-medium text-gray-900 mb-3">
            Existing Images ({existingImages.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {existingImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <ImageIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 