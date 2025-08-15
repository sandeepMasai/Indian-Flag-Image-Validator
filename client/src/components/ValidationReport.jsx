import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ✅ Icon component for pass/fail status
const StatusIcon = ({ status }) => {
  return status === "pass" ? (
    <CheckCircle2 className="w-4 h-4 text-green-600" />
  ) : (
    <XCircle className="w-4 h-4 text-red-500" />
  );
};

// ✅ Badge component for pass/fail status
const StatusBadge = ({ status }) => {
  return (
    <Badge
      variant={status === "pass" ? "default" : "destructive"}
      className={cn(
        "px-2 py-0.5 text-xs rounded-md font-medium border",
        status === "pass"
          ? "bg-green-100 text-green-700 border-green-300"
          : "bg-red-100 text-red-700 border-red-300"
      )}
    >
      {status === "pass" ? "PASS" : "FAIL"}
    </Badge>
  );
};

export const ValidationReport = ({ result, isAnalyzing }) => {
  if (isAnalyzing) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <CardTitle>Analyzing Flag...</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Running BIS specification validation checks...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-muted-foreground" />
            <CardTitle>Validation Report</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Upload and analyze a flag image to see the validation report.
          </p>
        </CardContent>
      </Card>
    );
  }

  const jsonReport = {
    aspect_ratio: result.aspect_ratio,
    colors: result.colors,
    stripe_proportion: result.stripe_proportion,
    chakra_position: result.chakra_position,
    chakra_spokes: result.chakra_spokes,
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto px-4">
      {/* ✅ Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Validation Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {result.passed_checks}/{result.total_checks}
              </div>
              <div className="text-sm text-muted-foreground">
                Checks Passed
              </div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {result.processing_time.toFixed(2)}s
              </div>
              <div className="text-sm text-muted-foreground">
                Processing Time
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ✅ Detailed Results */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Aspect Ratio */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusIcon status={result.aspect_ratio.status} />
                <span className="font-medium">Aspect Ratio</span>
              </div>
              <StatusBadge status={result.aspect_ratio.status} />
            </div>
            <div className="text-sm text-muted-foreground pl-6">
              Expected: {result.aspect_ratio.expected} • Actual:{" "}
              {result.aspect_ratio.actual}
            </div>
          </div>

          <Separator />

          {/* Color Accuracy */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-saffron via-flag-white to-flag-green rounded-sm" />
              <span className="font-medium">Color Accuracy</span>
            </div>
            <div className="space-y-2 pl-6">
              {Object.entries(result.colors).map(([color, data]) => (
                <div key={color} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusIcon status={data.status} />
                    <span className="capitalize text-sm">
                      {color.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {data.deviation}
                    </span>
                    <StatusBadge status={data.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Stripe Proportions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusIcon status={result.stripe_proportion.status} />
                <span className="font-medium">Stripe Proportions</span>
              </div>
              <StatusBadge status={result.stripe_proportion.status} />
            </div>
            <div className="text-sm text-muted-foreground pl-6 space-y-1">
              <div>Top (Saffron): {result.stripe_proportion.top}</div>
              <div>Middle (White): {result.stripe_proportion.middle}</div>
              <div>Bottom (Green): {result.stripe_proportion.bottom}</div>
            </div>
          </div>

          <Separator />

          {/* Chakra Position */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusIcon status={result.chakra_position.status} />
                <span className="font-medium">Chakra Position</span>
              </div>
              <StatusBadge status={result.chakra_position.status} />
            </div>
            <div className="text-sm text-muted-foreground pl-6">
              Offset: X={result.chakra_position.offset_x}, Y=
              {result.chakra_position.offset_y}
            </div>
          </div>

          <Separator />

          {/* Chakra Spokes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusIcon status={result.chakra_spokes.status} />
                <span className="font-medium">Chakra Spokes</span>
              </div>
              <StatusBadge status={result.chakra_spokes.status} />
            </div>
            <div className="text-sm text-muted-foreground pl-6">
              Expected: {result.chakra_spokes.expected} • Detected:{" "}
              {result.chakra_spokes.detected}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ✅ JSON Report */}
      <Card>
        <CardHeader>
          <CardTitle>JSON Report</CardTitle>
        </CardHeader>
        <CardContent>
          <details className="text-sm">
            <summary className="cursor-pointer text-blue-600 hover:underline mb-2">
              Show raw JSON
            </summary>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(jsonReport, null, 2)}
            </pre>
          </details>
        </CardContent>
      </Card>
    </div>
  );
};
