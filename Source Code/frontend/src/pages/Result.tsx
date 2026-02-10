import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Home, ArrowLeft, Download, RotateCcw, Calendar, User, Cpu, AlertTriangle, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

import fundusImage from '@/assets/fundus_sample.jpg';
import gradcamImage from '@/assets/gradcam.png';
import discMask from '@/assets/disc_mask.png';
import cupMask from '@/assets/cup_mask.png';

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

const Result = () => {
  const navigate = useNavigate();
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  useEffect(() => {
    // Load data from localStorage
    const storedData = localStorage.getItem('predictionData');
    const storedImage = localStorage.getItem('uploadedImage');
    
    if (storedData) {
      try {
        setPredictionData(JSON.parse(storedData));
      } catch (error) {
        console.error('Error parsing prediction data:', error);
      }
    }
    
    if (storedImage) {
      setUploadedImage(storedImage);
    }
  }, []);
  
  // Fallback to mock data if no real data
  const mockCDR = { vertical: 0.63, area: 0.61 };
  const mockPrediction = { label: 'Glaucoma', prob: 0.94 };
  
  const cdr = predictionData?.cdr || mockCDR;
  const prediction = predictionData?.prediction || mockPrediction;
  
  const isGlaucoma = prediction.label.toLowerCase() === 'glaucoma';
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleDownloadPDF = () => {
    alert('PDF download functionality will be implemented with backend integration.');
  };
  
  const handleNewScreening = () => {
    // Clear stored data and navigate back
    localStorage.removeItem('predictionData');
    localStorage.removeItem('uploadedImage');
    navigate('/upload');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">FusionNet-Vision</h1>
                <p className="text-xs text-muted-foreground">Clinical Report</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                to="/upload" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Screening
              </Link>
              <Link 
                to="/" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Report Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="medical-card p-8 mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-border">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Glaucoma Screening Report
                </h1>
                <p className="text-muted-foreground">
                  AI-Powered Retinal Analysis Results
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{currentDate}</span>
              </div>
            </div>

            {/* Patient Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Patient ID</p>
                  <p className="font-medium text-foreground">DEMO-2024-001</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
                <Eye className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Study Type</p>
                  <p className="font-medium text-foreground">Retinal Fundus Analysis</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
                <Cpu className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">AI Model</p>
                  <p className="font-medium text-foreground">InceptionV3 + CatBoost</p>
                </div>
              </div>
            </div>

            {/* Primary Diagnosis */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className={`
                p-8 rounded-2xl text-center mb-8
                ${isGlaucoma ? 'bg-destructive/10 border-2 border-destructive/30' : 'bg-success/10 border-2 border-success/30'}
              `}
            >
              <div className="flex justify-center mb-4">
                {isGlaucoma ? (
                  <AlertTriangle className="w-16 h-16 text-destructive" />
                ) : (
                  <CheckCircle className="w-16 h-16 text-success" />
                )}
              </div>
              <h2 className="text-4xl font-bold mb-2">
                {prediction.label}
              </h2>
              <p className="text-lg text-muted-foreground">
                Confidence: <span className="font-semibold">{Math.round(prediction.prob * 100)}%</span>
              </p>
            </motion.div>
          </motion.div>

          {/* Image Analysis Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="medical-card p-8 mb-8"
          >
            <h2 className="text-xl font-semibold text-foreground mb-6">Image Analysis</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="aspect-square rounded-xl overflow-hidden mb-3 shadow-md">
                  <img src={uploadedImage || fundusImage} alt="Original" className="w-full h-full object-cover" />
                </div>
                <p className="font-medium text-foreground">Original Image</p>
                <p className="text-xs text-muted-foreground">Input fundus photograph</p>
              </div>
              <div className="text-center">
                <div className="aspect-square rounded-xl overflow-hidden mb-3 shadow-md bg-foreground/10">
                  <img src={predictionData?.segmentation?.disc ? `data:image/png;base64,${predictionData.segmentation.disc}` : discMask} alt="Optic Disc" className="w-full h-full object-cover" />
                </div>
                <p className="font-medium text-foreground">Optic Disc</p>
                <p className="text-xs text-muted-foreground">Segmented disc region</p>
              </div>
              <div className="text-center">
                <div className="aspect-square rounded-xl overflow-hidden mb-3 shadow-md bg-foreground/10">
                  <img src={predictionData?.segmentation?.cup ? `data:image/png;base64,${predictionData.segmentation.cup}` : cupMask} alt="Optic Cup" className="w-full h-full object-cover" />
                </div>
                <p className="font-medium text-foreground">Optic Cup</p>
                <p className="text-xs text-muted-foreground">Segmented cup region</p>
              </div>
              <div className="text-center">
                <div className="aspect-square rounded-xl overflow-hidden mb-3 shadow-md">
                  <img src={predictionData?.gradcam ? `data:image/png;base64,${predictionData.gradcam}` : gradcamImage} alt="Grad-CAM" className="w-full h-full object-cover" />
                </div>
                <p className="font-medium text-foreground">Grad-CAM</p>
                <p className="text-xs text-muted-foreground">Model attention map</p>
              </div>
            </div>
          </motion.div>

          {/* CDR Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="medical-card p-8 mb-8"
          >
            <h2 className="text-xl font-semibold text-foreground mb-6">Cup-to-Disc Ratio Analysis</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-muted/30 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium text-foreground">Vertical CDR</span>
                  <span className={`text-3xl font-bold ${cdr.vertical > 0.6 ? 'text-destructive' : cdr.vertical > 0.5 ? 'text-warning' : 'text-success'}`}>
                    {cdr.vertical.toFixed(2)}
                  </span>
                </div>
                <div className="h-4 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cdr.vertical * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full rounded-full ${cdr.vertical > 0.6 ? 'bg-destructive' : cdr.vertical > 0.5 ? 'bg-warning' : 'bg-success'}`}
                  />
                </div>
                <p className={`mt-2 text-sm font-medium ${cdr.vertical > 0.6 ? 'text-destructive' : cdr.vertical > 0.5 ? 'text-warning' : 'text-success'}`}>
                  {cdr.vertical < 0.5 ? 'Normal' : cdr.vertical <= 0.6 ? 'At Risk' : 'Glaucoma Suspect'}
                </p>
              </div>

              <div className="p-6 bg-muted/30 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium text-foreground">Area CDR</span>
                  <span className={`text-3xl font-bold ${cdr.area > 0.6 ? 'text-destructive' : cdr.area > 0.5 ? 'text-warning' : 'text-success'}`}>
                    {cdr.area.toFixed(2)}
                  </span>
                </div>
                <div className="h-4 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cdr.area * 100}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className={`h-full rounded-full ${cdr.area > 0.6 ? 'bg-destructive' : cdr.area > 0.5 ? 'bg-warning' : 'bg-success'}`}
                  />
                </div>
                <p className={`mt-2 text-sm font-medium ${cdr.area > 0.6 ? 'text-destructive' : cdr.area > 0.5 ? 'text-warning' : 'text-success'}`}>
                  {cdr.area < 0.5 ? 'Normal' : cdr.area <= 0.6 ? 'At Risk' : 'Glaucoma Suspect'}
                </p>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 p-4 bg-accent/30 rounded-xl">
              <p className="text-sm font-medium text-foreground mb-2">Interpretation Guide:</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-sm text-muted-foreground">&lt; 0.5: Normal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span className="text-sm text-muted-foreground">0.5–0.6: At Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-sm text-muted-foreground">&gt; 0.6: Glaucoma Suspect</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center mb-8"
          >
            <button
              onClick={handleDownloadPDF}
              className="medical-button inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download PDF Report
            </button>
            <button onClick={handleNewScreening} className="medical-button-outline inline-flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              New Screening
            </button>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="medical-card p-6 bg-warning/5 border-warning/20"
          >
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-warning">⚠️ Disclaimer: </span>
              This is an AI-assisted screening tool for research purposes only. Results should be validated by 
              qualified ophthalmologists. This system is not intended for clinical diagnosis without professional review.
              Always consult with a healthcare professional for proper medical advice.
            </p>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            FusionNet-Vision © 2024 • Research Demo • Not for Clinical Use
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Result;
