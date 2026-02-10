import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Home, ArrowRight, Play, Loader2, Download, Database, Images } from 'lucide-react';

import Stepper from '@/components/Stepper';
import UploadBox from '@/components/UploadBox';
import ValidationAlert from '@/components/ValidationAlert';
import PreprocessingPanel from '@/components/PreprocessingPanel';
import SegmentationPanel from '@/components/SegmentationPanel';
import CDRGauge from '@/components/CDRGauge';
import ClassificationCard from '@/components/ClassificationCard';
import ExplainabilityPanel from '@/components/ExplainabilityPanel';
import ReportPanel from '@/components/ReportPanel';
import SampleImagesModal from '@/components/SampleImagesModal';
import MultiplePredictions from '@/components/MultiplePredictions';
import { apiService, type PredictionResponse } from '@/services/api';

import fundusImage from '@/assets/fundus_sample.jpg';

const PIPELINE_STEPS = [
  { id: 1, name: 'Upload Retinal Fundus Image', shortName: 'Upload' },
  { id: 2, name: 'Image Validation', shortName: 'Validate' },
  { id: 3, name: 'Preprocessing', shortName: 'Preprocess' },
  { id: 4, name: 'Segmentation', shortName: 'Segment' },
  { id: 5, name: 'CDR Computation', shortName: 'CDR' },
  { id: 6, name: 'Classification', shortName: 'Classify' },
  { id: 7, name: 'Explainability', shortName: 'Explain' },
  { id: 8, name: 'Final Report', shortName: 'Report' },
];

// Mock data for demonstration
const mockCDR = { vertical: 0.63, area: 0.61 };
const mockPrediction = { label: 'Glaucoma', prob: 0.94 };

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

interface MultiplePredictionData {
  [imageIndex: number]: PredictionData;
}

const Upload = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [multiplePredictions, setMultiplePredictions] = useState<MultiplePredictionData>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [showSampleImages, setShowSampleImages] = useState(false);
  
  // Real validation flag - starts as false, only set true after backend validation
  const [isFundus, setIsFundus] = useState<boolean[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const isValid = uploadedImages.length > 0 && isFundus.length > 0 && isFundus.every(fundus => fundus);

  const handleImageUpload = useCallback(async (files: File[], previews: string[]) => {
    setUploadedFiles(files);
    setUploadedImages(previews);
    setCurrentStep(2);
    setIsValidating(true);
    setIsFundus(new Array(files.length).fill(false));
    setApiError(null);
    
    // Validate each file with backend
    try {
      const validationPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch('http://localhost:5000/predict', {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        return result.validation;
      });
      
      const validationResults = await Promise.all(validationPromises);
      const allValid = validationResults.every(result => result);
      
      if (allValid) {
        setIsFundus(new Array(files.length).fill(true));  // All valid REFUGE images
        console.log('✅ All images are valid REFUGE images');
      } else {
        setIsFundus(validationResults); // Some or all invalid images
        setApiError('Some images are invalid retinal fundus images');
        console.log('❌ Invalid images detected');
      }
    } catch (error) {
      setIsFundus(new Array(files.length).fill(false));
      setApiError('Validation failed');
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  }, []);

  const handleClearImage = useCallback(() => {
    setUploadedImages([]);
    setUploadedFiles([]);
    setCurrentStep(1);
    setIsFundus([]);
    setApiError(null);
    setIsValidating(false);
  }, []);

  const runPipeline = useCallback(async () => {
    if (!isValid || uploadedFiles.length === 0) return;
    
    setIsProcessing(true);
    setApiError(null);
    
    try {
      // Simulate pipeline steps with delays for better UX
      const stepDelays = [800, 1000, 1200, 800, 1000, 800];
      
      // Process each image
      const predictionPromises = uploadedFiles.map(async (file) => {
        return apiService.predictImage(file);
      });
      
      // Show progress through steps
      for (let i = 0; i < stepDelays.length; i++) {
        await new Promise(resolve => setTimeout(resolve, stepDelays[i]));
        setCurrentStep(prev => prev + 1);
      }
      
      // Wait for all API responses
      const responses: PredictionResponse[] = await Promise.all(predictionPromises);
      
      // Process all responses and store them
      const multipleData: MultiplePredictionData = {};
      responses.forEach((response, index) => {
        if (response.validation && response.cdr && response.prediction) {
          multipleData[index] = {
            cdr: response.cdr,
            prediction: {
              label: response.prediction,
              prob: response.probability || 0
            },
            segmentation: response.segmentation,
            gradcam: response.gradcam
          };
        }
      });
      
      setMultiplePredictions(multipleData);
      
      // Also set first response for backward compatibility
      const firstResponse = responses[0];
      if (firstResponse.validation && firstResponse.cdr && firstResponse.prediction) {
        const data: PredictionData = {
          cdr: firstResponse.cdr,
          prediction: {
            label: firstResponse.prediction,
            prob: firstResponse.probability || 0
          },
          segmentation: firstResponse.segmentation,
          gradcam: firstResponse.gradcam
        };
        setPredictionData(data);
        
        // Store data for result page
        localStorage.setItem('predictionData', JSON.stringify(data));
        localStorage.setItem('multiplePredictions', JSON.stringify(multipleData));
        if (uploadedImages.length > 0) {
          localStorage.setItem('uploadedImage', uploadedImages[0]);
        }
      } else {
        setApiError(firstResponse.error || 'Prediction failed');
        
        // Check if it's a fundus image validation error
        if (firstResponse.error && firstResponse.error.includes('fundus')) {
          setIsFundus(new Array(uploadedFiles.length).fill(false));  // Mark as non-fundus image
        }
      }
    } catch (error) {
      console.error('Pipeline error:', error);
      setApiError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  }, [isValid, uploadedFiles, uploadedImages]);

  const handleReset = useCallback(() => {
    setUploadedImages([]);
    setUploadedFiles([]);
    setCurrentStep(1);
    setIsFundus([]);
    setIsProcessing(false);
    setPredictionData(null);
    setMultiplePredictions({});
    setApiError(null);
    localStorage.removeItem('predictionData');
    localStorage.removeItem('multiplePredictions');
    localStorage.removeItem('uploadedImage');
  }, []);

  const handleViewReport = () => {
    navigate('/result');
  };

  const handleViewDataset = () => {
    window.open('https://drive.google.com/drive/folders/1zix_Yx3a8FEV2ZdI5gh0uUnegq5lr0Zt?usp=sharing', '_blank');
  };

  const handleSampleImages = () => {
    setShowSampleImages(true);
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
                <p className="text-xs text-muted-foreground">Glaucoma Detection System</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleViewDataset}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-accent"
              >
                <Database className="w-4 h-4" />
                View Dataset
              </button>
              <button
                onClick={handleSampleImages}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-accent"
              >
                <Images className="w-4 h-4" />
                Sample Images
              </button>
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

      {/* Stepper */}
      <div className="bg-card border-b border-border py-6">
        <div className="container mx-auto px-4">
          <Stepper steps={PIPELINE_STEPS} currentStep={currentStep} />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Step 1: Upload */}
          <AnimatePresence mode="wait">
            {currentStep >= 1 && (
              <motion.section
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="section-title">1. Upload Retinal Fundus Image</h2>
                <UploadBox 
                  onImageUpload={handleImageUpload}
                  uploadedImages={uploadedImages}
                  onClear={handleClearImage}
                />
              </motion.section>
            )}

            {/* Step 2: Validation */}
            {currentStep >= 2 && uploadedImages.length > 0 && (
              <motion.section
                key="validation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="section-title">2. Image Validation</h2>
                
                {/* Validation Loading State */}
                {isValidating && (
                  <div className="medical-card border-blue-50 bg-blue-50/50 p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-blue-700">Validating image with REFUGE dataset...</span>
                    </div>
                  </div>
                )}
                
                {/* Validation Result */}
                {!isValidating && uploadedImages.length > 0 && (
                  <ValidationAlert isValid={isValid} isFundus={isFundus} />
                )}
                
                {/* API Error Display */}
                {apiError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-xl"
                  >
                    <p className="text-destructive font-medium">Error: {apiError}</p>
                  </motion.div>
                )}
                
                {/* Run Pipeline Button */}
                {isValid && currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 flex justify-center"
                  >
                    <button
                      onClick={runPipeline}
                      disabled={isProcessing}
                      className="medical-button inline-flex items-center gap-2 text-lg px-8 py-4"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          Run Full Analysis Pipeline
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </motion.section>
            )}

            {/* Step 3: Preprocessing */}
            {currentStep >= 3 && (
              <motion.section
                key="preprocessing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="section-title">3. Preprocessing</h2>
                <PreprocessingPanel originalImage={uploadedImages[0] || fundusImage} />
              </motion.section>
            )}

            {/* Step 4: Segmentation */}
            {currentStep >= 4 && (
              <motion.section
                key="segmentation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="section-title">4. Segmentation (Optic Disc & Cup)</h2>
                <SegmentationPanel originalImage={uploadedImages[0] || fundusImage} />
              </motion.section>
            )}

            {/* Step 5: CDR */}
            {currentStep >= 5 && (
              <motion.section
                key="cdr"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="section-title">5. CDR Computation</h2>
                <CDRGauge 
                  verticalCDR={predictionData?.cdr.vertical || mockCDR.vertical} 
                  areaCDR={predictionData?.cdr.area || mockCDR.area} 
                />
              </motion.section>
            )}

            {/* Step 6: Classification */}
            {currentStep >= 6 && (
              <motion.section
                key="classification"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="section-title">6. Classification</h2>
                
                {/* Show multiple predictions if available */}
                {Object.keys(multiplePredictions).length > 0 ? (
                  <MultiplePredictions 
                    predictions={multiplePredictions} 
                    uploadedImages={uploadedImages} 
                  />
                ) : (
                  <ClassificationCard 
                    prediction={predictionData?.prediction.label || mockPrediction.label}
                    probability={predictionData?.prediction.prob || mockPrediction.prob}
                    model="InceptionV3 + CatBoost (Hybrid Pipeline)"
                  />
                )}
              </motion.section>
            )}

            {/* Step 7: Explainability */}
            {currentStep >= 7 && (
              <motion.section
                key="explainability"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="section-title">7. Explainability (Grad-CAM)</h2>
                <ExplainabilityPanel originalImage={uploadedImages[0] || fundusImage} />
              </motion.section>
            )}

            {/* Step 8: Report */}
            {currentStep >= 8 && (
              <motion.section
                key="report"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="section-title">8. Final Report Dashboard</h2>
                <ReportPanel 
                  originalImage={uploadedImages[0] || fundusImage}
                  cdr={predictionData?.cdr || mockCDR}
                  prediction={predictionData?.prediction || mockPrediction}
                  onReset={handleReset}
                />
              </motion.section>
            )}
          </AnimatePresence>

          {/* Quick Demo Button */}
          {currentStep === 1 && uploadedImages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center pt-8"
            >
              <p className="text-muted-foreground mb-4">
                No image to upload? Try our demo with a sample fundus image.
              </p>
              <button
                onClick={() => {
                  setUploadedImages([fundusImage]);
                  setCurrentStep(2);
                }}
                className="medical-button-outline inline-flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Use Sample Image
              </button>
            </motion.div>
          )}
        </div>
      </main>

      {/* Sample Images Modal */}
      <SampleImagesModal 
        isOpen={showSampleImages} 
        onClose={() => setShowSampleImages(false)} 
      />
    </div>
  );
};

export default Upload;
