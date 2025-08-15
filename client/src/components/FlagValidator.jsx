import React from 'react'
import log from '../assets/Flag_of_India.svg'
import { useState, useCallback } from "react";
import { ImageUpload } from "./ImageUpload";
import { ValidationReport } from "./ValidationReport";
import { FlagAnalyzer } from "./FlagAnalyzer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Timer, Flag, CheckCircle2, XCircle } from "lucide-react";

export const FlagValidator = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [validationResult, setValidationResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageUpload = useCallback((file) => {
    setUploadedImage(file);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setValidationResult(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!uploadedImage || !imageUrl) return;

    setIsAnalyzing(true);
    const startTime = performance.now();

    try {
      const analyzer = new FlagAnalyzer();
      const result = await analyzer.analyzeFlag(imageUrl);
      const endTime = performance.now();
      
      const processingTime = (endTime - startTime) / 1000; // seconds

      setValidationResult({
        ...result,
        processing_time: processingTime
      });
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [uploadedImage, imageUrl]);

  const getOverallStatusBadge = () => {
    if (!validationResult) return null;

    const { overall_status, passed_checks, total_checks } = validationResult;

    return (

      <div className="flex items-center gap-2"> 
        {overall_status === "pass" ? (
          <Badge variant="default" className="bg-success text-success-foreground">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            BIS Compliant
          </Badge>
        ) : (
          <Badge variant="destructive">
            <XCircle className="w-4 h-4 mr-1" />
            Non-Compliant
          </Badge>
        )}
        <Badge variant="outline">
          {passed_checks}/{total_checks} checks passed
        </Badge>
        <Badge variant="outline" className="text-muted-foreground">
          <Timer className="w-3 h-3 mr-1" />
          {validationResult.processing_time.toFixed(2)}s
        </Badge>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
     <div className="bg-card/80 backdrop-blur-sm border-b shadow-elegant sticky top-0 z-10">
  <div className="container mx-auto px-4 py-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 overflow-hidden rounded shadow-md">
        <img
          src={log}
          alt="Indian Flag"
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Indian Flag Validator
        </h1>
        <p className="text-muted-foreground">
          Independence Day Coding Challenge • BIS Specification Compliance
        </p>
      </div>
    </div>

    {getOverallStatusBadge()}
  </div>
</div>


      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">
                Upload Flag Image
              </h2>
              <ImageUpload 
                onImageUpload={handleImageUpload} 
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
                hasImage={!!uploadedImage}
              />
            </Card>

            {imageUrl && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-foreground">
                  Uploaded Image
                </h3>
                <div className="border rounded-lg overflow-hidden bg-checkered">
                  <img 
                    src={imageUrl} 
                    alt="Uploaded flag" 
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </div>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ValidationReport result={validationResult} isAnalyzing={isAnalyzing} />
          </div>
        </div>
      </div>
    </div>
  );
};


