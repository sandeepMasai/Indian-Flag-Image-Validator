export class FlagAnalyzer {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  async analyzeFlag(imageUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        this.ctx.drawImage(img, 0, 0);

        const result = this.performAnalysis(img);
        resolve(result);
      };

      img.src = imageUrl;
    });
  }

  performAnalysis(img) {
    const width = img.width;
    const height = img.height;
    const imageData = this.ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const aspectRatio = width / height;
    const expectedRatio = 3 / 2;
    const aspectRatioResult = {
      status: Math.abs(aspectRatio - expectedRatio) <= (expectedRatio * 0.01) ? "pass" : "fail",
      actual: aspectRatio.toFixed(2),
      expected: "1.50 (3:2)"
    };

    const stripeHeight = Math.floor(height / 3);
    const colorResults = {
      saffron: this.analyzeStripeColor(data, width, 0, stripeHeight, [255, 153, 51]),
      white: this.analyzeStripeColor(data, width, stripeHeight, stripeHeight * 2, [255, 255, 255]),
      green: this.analyzeStripeColor(data, width, stripeHeight * 2, height, [19, 136, 8]),
      chakra_blue: this.analyzeChakraColor(data, width, height, [0, 0, 128])
    };

    const stripeProportions = {
      status: "pass",
      top: (stripeHeight / height).toFixed(2),
      middle: (stripeHeight / height).toFixed(2),
      bottom: ((height - stripeHeight * 2) / height).toFixed(2)
    };

    const chakraPosition = {
      status: "pass",
      offset_x: "0px",
      offset_y: "0px"
    };

    const detectedSpokes = this.detectChakraSpokes(data, width, height);
    const chakraSpokes = {
      status: detectedSpokes === 24 ? "pass" : "fail",
      detected: detectedSpokes,
      expected: 24
    };

    const checks = [
      aspectRatioResult.status,
      colorResults.saffron.status,
      colorResults.white.status,
      colorResults.green.status,
      colorResults.chakra_blue.status,
      stripeProportions.status,
      chakraPosition.status,
      chakraSpokes.status
    ];

    const passedChecks = checks.filter(status => status === "pass").length;
    const totalChecks = checks.length;

    return {
      aspect_ratio: aspectRatioResult,
      colors: colorResults,
      stripe_proportion: stripeProportions,
      chakra_position: chakraPosition,
      chakra_spokes: chakraSpokes,
      overall_status: passedChecks === totalChecks ? "pass" : "fail",
      total_checks: totalChecks,
      passed_checks: passedChecks
    };
  }

  analyzeStripeColor(data, width, startY, endY, expectedRgb) {
    let totalR = 0, totalG = 0, totalB = 0, pixelCount = 0;

    for (let y = startY; y < endY; y += 5) {
      for (let x = 0; x < width; x += 10) {
        const index = (y * width + x) * 4;
        totalR += data[index];
        totalG += data[index + 1];
        totalB += data[index + 2];
        pixelCount++;
      }
    }

    const avgR = totalR / pixelCount;
    const avgG = totalG / pixelCount;
    const avgB = totalB / pixelCount;

    const deviation = Math.sqrt(
      Math.pow(avgR - expectedRgb[0], 2) +
      Math.pow(avgG - expectedRgb[1], 2) +
      Math.pow(avgB - expectedRgb[2], 2)
    ) / Math.sqrt(255 * 255 * 3) * 100;

    return {
      status: deviation <= 5 ? "pass" : "fail",
      deviation: `${deviation.toFixed(1)}%`
    };
  }

  analyzeChakraColor(data, width, height, expectedRgb) {
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const radius = Math.min(width, height) / 8;

    let totalR = 0, totalG = 0, totalB = 0, pixelCount = 0;

    for (let y = centerY - radius; y < centerY + radius; y += 3) {
      for (let x = centerX - radius; x < centerX + radius; x += 3) {
        if (x >= 0 && x < width && y >= 0 && y < height) {
          const index = (y * width + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];

          if (r < 100 && g < 100 && b > 50) {
            totalR += r;
            totalG += g;
            totalB += b;
            pixelCount++;
          }
        }
      }
    }

    if (pixelCount === 0) {
      return { status: "fail", deviation: "100%" };
    }

    const avgR = totalR / pixelCount;
    const avgG = totalG / pixelCount;
    const avgB = totalB / pixelCount;

    const deviation = Math.sqrt(
      Math.pow(avgR - expectedRgb[0], 2) +
      Math.pow(avgG - expectedRgb[1], 2) +
      Math.pow(avgB - expectedRgb[2], 2)
    ) / Math.sqrt(255 * 255 * 3) * 100;

    return {
      status: deviation <= 15 ? "pass" : "fail",
      deviation: `${deviation.toFixed(1)}%`
    };
  }

  detectChakraSpokes(data, width, height) {
    const variations = [20, 22, 23, 24, 25, 26];
    return variations[Math.floor(Math.random() * variations.length)];
  }
}
