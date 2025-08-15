import React from 'react'

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Image, Loader2, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const ImageUpload = ({ onImageUpload, onAnalyze, isAnalyzing, hasImage }) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file");
        return;
      }

      onImageUpload(file);
      toast.success("Image uploaded successfully!");
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".svg", ".webp"]
    },
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  return (
    <div className="space-y-4">
      <Card
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed transition-all duration-200 cursor-pointer",
          "hover:border-primary hover:bg-primary/5",
          (isDragActive || dragActive) && "border-primary bg-primary/10",
          "p-8 text-center"
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
              (isDragActive || dragActive)
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {hasImage ? (
              <Image className="w-8 h-8" />
            ) : (
              <Upload className="w-8 h-8" />
            )}
          </div>

          <div>
            <p className="text-lg font-medium text-foreground mb-1">
              {hasImage ? "Upload a new image" : "Drop your flag image here"}
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse • PNG, JPG, SVG supported • Max 5MB
            </p>
          </div>
        </div>
      </Card>

      {hasImage && (
        <Button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          size="lg"
          className="w-full bg-gradient-to-r from-saffron to-flag-green text-flag-white hover:opacity-90 shadow-patriotic"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Analyzing Flag...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Validate Against BIS Standards
            </>
          )}
        </Button>
      )}
    </div>
  );
};

