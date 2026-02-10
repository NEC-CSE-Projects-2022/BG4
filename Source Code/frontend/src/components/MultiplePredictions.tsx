import { motion } from 'framer-motion';
import { Eye, AlertTriangle, CheckCircle, Download } from 'lucide-react';

interface PredictionData {
  cdr: { vertical: number; area: number };
  prediction: { label: string; prob: number };
  segmentation?: {
    disc: string;
    cup: string;
    overlay: string;
  };
  gradcam?: string;
}

interface MultiplePredictionsProps {
  predictions: { [imageIndex: number]: PredictionData };
  uploadedImages: string[];
}

const MultiplePredictions = ({ predictions, uploadedImages }: MultiplePredictionsProps) => {
  const getGlaucomaStatus = (label: string) => {
    return label.toLowerCase() === 'glaucoma';
  };

  const getCDRStatus = (cdr: { vertical: number; area: number }) => {
    if (cdr.vertical > 0.7 || cdr.area > 0.7) return { status: 'high', color: 'text-destructive' };
    if (cdr.vertical > 0.6 || cdr.area > 0.6) return { status: 'moderate', color: 'text-yellow-600' };
    return { status: 'normal', color: 'text-success' };
  };

  const handleDownloadPDF = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups for this website to download PDF reports.');
      return;
    }

    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    let imagesHtml = '';
    uploadedImages.forEach((image, index) => {
      const prediction = predictions[index];
      if (!prediction) return;

      const isGlaucoma = getGlaucomaStatus(prediction.prediction.label);
      const cdrStatus = getCDRStatus(prediction.cdr);

      imagesHtml += `
        <div style="margin-bottom: 30px; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
          <div style="display: flex; align-items: center; margin-bottom: 15px;">
            <div style="font-weight: bold; font-size: 16px;">Image ${index + 1} Analysis</div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div>
              <div style="font-weight: bold; margin-bottom: 10px;">Classification Result</div>
              <div style="padding: 15px; border-radius: 8px; text-align: center; font-size: 18px; font-weight: bold; ${isGlaucoma ? 'background: #fef2f2; border: 2px solid #ef4444; color: #ef4444;' : 'background: #f0fdf4; border: 2px solid #22c55e; color: #22c55e;'}">
                ${prediction.prediction.label}
              </div>
              <div style="margin-top: 10px; font-size: 14px;">
                Confidence: ${Math.round(prediction.prediction.prob * 100)}%
              </div>
            </div>
            
            <div>
              <div style="font-weight: bold; margin-bottom: 10px;">CDR Values</div>
              <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
                <div style="margin-bottom: 5px;">
                  <strong>Vertical CDR:</strong> ${prediction.cdr.vertical.toFixed(2)}
                </div>
                <div style="margin-bottom: 5px;">
                  <strong>Area CDR:</strong> ${prediction.cdr.area.toFixed(2)}
                </div>
                <div style="font-size: 12px; color: ${cdrStatus.color};">
                  <strong>Status:</strong> ${cdrStatus.status.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Glaucoma Detection Report - Multiple Images</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #0ea5e9;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .title {
            color: #0ea5e9;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .summary {
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          .disclaimer {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin-top: 30px;
            font-size: 12px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
          @media print {
            body { margin: 10px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">FusionNet-Vision Glaucoma Detection Report</div>
          <div>Multiple Image Analysis - Clinical Screening Results</div>
          <div style="margin-top: 10px; font-size: 14px; color: #6b7280;">
            Generated on: ${currentDate}
          </div>
        </div>

        <div class="summary">
          <div style="font-weight: bold; margin-bottom: 10px;">Analysis Summary</div>
          <div>Total Images Analyzed: ${uploadedImages.length}</div>
          <div>AI Model: InceptionV3 + CatBoost (Hybrid Pipeline)</div>
        </div>

        <div style="margin-bottom: 30px;">
          <div style="font-weight: bold; font-size: 18px; margin-bottom: 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
            Individual Image Results
          </div>
          ${imagesHtml}
        </div>

        <div class="disclaimer">
          <strong>Disclaimer:</strong> This is an AI-assisted screening tool for research purposes only. 
          Results should be validated by qualified ophthalmologists. This system is not intended for clinical diagnosis without professional review.
        </div>

        <div class="footer">
          <div>FusionNet-Vision Glaucoma Detection System</div>
          <div>© 2024 - Medical AI Research</div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for content to load, then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Analysis Results for {uploadedImages.length} Images
        </h3>
        <p className="text-muted-foreground">
          Individual glaucoma detection results for each uploaded image
        </p>
        <button
          onClick={handleDownloadPDF}
          className="medical-button flex items-center gap-2 mt-4"
        >
          <Download className="w-4 h-4" />
          Download PDF Report
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {uploadedImages.map((image, index) => {
          const prediction = predictions[index];
          if (!prediction) return null;

          const isGlaucoma = getGlaucomaStatus(prediction.prediction.label);
          const cdrStatus = getCDRStatus(prediction.cdr);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="medical-card p-4"
            >
              {/* Image Preview */}
              <div className="mb-4">
                <img
                  src={image}
                  alt={`Analysis result ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-border"
                />
              </div>

              {/* Image Info */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">Image {index + 1}</span>
                </div>
              </div>

              {/* Prediction Result */}
              <div className="space-y-3">
                <div className={`p-3 rounded-lg border ${
                  isGlaucoma 
                    ? 'bg-destructive/10 border-destructive/30' 
                    : 'bg-success/10 border-success/30'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    {isGlaucoma ? (
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-success" />
                    )}
                    <span className={`font-medium ${
                      isGlaucoma ? 'text-destructive' : 'text-success'
                    }`}>
                      {prediction.prediction.label}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Confidence: {(prediction.prediction.prob * 100).toFixed(1)}%
                  </div>
                </div>

                {/* CDR Values */}
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-sm font-medium text-foreground mb-2">CDR Values</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vertical:</span>
                      <span className={cdrStatus.color}>
                        {prediction.cdr.vertical.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Area:</span>
                      <span className={cdrStatus.color}>
                        {prediction.cdr.area.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className={`text-xs mt-2 ${cdrStatus.color}`}>
                    Status: {cdrStatus.status.toUpperCase()}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MultiplePredictions;
