import { useState, useRef } from 'react';
import { Camera, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhotoUploadProps {
  photos: (File | null)[];
  onPhotosChange: (photos: (File | null)[]) => void;
  maxPhotos?: number;
}

export function PhotoUpload({ photos, onPhotosChange, maxPhotos = 2 }: PhotoUploadProps) {
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleFileSelect = (index: number, file: File | null) => {
    const newPhotos = [...photos];
    newPhotos[index] = file;
    onPhotosChange(newPhotos);
  };

  const handleRemovePhoto = (index: number) => {
    handleFileSelect(index, null);
  };

  const triggerFileInput = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Upload 2 photos of yourself. Aunty wants to see that smile!
      </p>
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: maxPhotos }).map((_, index) => {
          const photo = photos[index];
          const previewUrl = photo ? URL.createObjectURL(photo) : null;

          return (
            <div
              key={index}
              className={cn(
                "relative aspect-square rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden",
                photo 
                  ? "border-primary/50 bg-primary/5" 
                  : "border-border hover:border-primary/30 hover:bg-muted/50"
              )}
              onClick={() => !photo && triggerFileInput(index)}
            >
              <input
                ref={(el) => (fileInputRefs.current[index] = el)}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  handleFileSelect(index, file);
                }}
              />

              {photo && previewUrl ? (
                <>
                  <img
                    src={previewUrl}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePhoto(index);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm text-xs font-medium">
                    Photo {index + 1}
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  {index === 0 ? (
                    <Camera className="h-8 w-8" />
                  ) : (
                    <Plus className="h-8 w-8" />
                  )}
                  <span className="text-xs font-medium">
                    {index === 0 ? 'Main Photo' : 'Photo 2'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
