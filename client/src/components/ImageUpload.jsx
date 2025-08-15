import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Image, Loader2, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const ImageUpload = ({ onImageUpload, onAnalyze, isAnalyzing, hasImage }) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
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
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".svg", ".webp"],
    },
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <Card
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer",
          "hover:border-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          (isDragActive || dragActive) && "border-primary bg-primary/20",
          "p-10 text-center flex flex-col items-center justify-center"
        )}
      >
        <input {...getInputProps()} aria-label="Flag image upload" />

        <div
          className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors duration-200",
            (isDragActive || dragActive)
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {hasImage ? (
            <Image className="w-10 h-10" aria-hidden="true" />
          ) : (
            <Upload className="w-10 h-10" aria-hidden="true" />
          )}
        </div>

        <div>
          <p className="text-xl font-semibold text-foreground mb-2 select-none">
            {hasImage ? "Upload a new image" : "Drop your flag image here"}
          </p>
          <p className="text-sm text-muted-foreground select-none">
            or click to browse &bull; PNG, JPG, SVG supported &bull; Max 5MB
          </p>
        </div>
      </Card>

      {hasImage && (
        <Button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          size="lg"
          className="w-full bg-gradient-to-r from-yellow-400 to-green-500 text-white font-semibold shadow-lg hover:opacity-90 focus:ring-4 focus:ring-yellow-300 rounded-lg transition"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
              Analyzing Flag...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" aria-hidden="true" />
              Validate Against BIS Standards
            </>
          )}
        </Button>
      )}
    </div>
  );
};
