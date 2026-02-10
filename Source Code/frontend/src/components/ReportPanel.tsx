import { motion } from 'framer-motion';
import { FileText, Download, RotateCcw, Calendar, User, Eye } from 'lucide-react';
import fundusImage from '@/assets/fundus_sample.jpg';
import gradcamImage from '@/assets/gradcam.png';
import discMask from '@/assets/disc_mask.png';
import cupMask from '@/assets/cup_mask.png';

interface ReportPanelProps {
  originalImage?: string;
  cdr: { vertical: number; area: number };
  prediction: { label: string; prob: number };
  onReset: () => void;
}

const ReportPanel = ({ originalImage, cdr, prediction, onReset }: ReportPanelProps) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="medical-card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">Clinical Report</h3>
            <p className="text-sm text-muted-foreground">Glaucoma Screening Analysis</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{currentDate}</span>
          </div>
        </div>
      </div>

      {/* Patient Info (Mock) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 p-4 bg-muted/30 rounded-xl flex items-center gap-4"
      >
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Patient ID</p>
          <p className="font-medium text-foreground">DEMO-2024-001</p>
        </div>
        <div className="ml-auto">
          <p className="text-sm text-muted-foreground">Study Type</p>
          <p className="font-medium text-foreground">Retinal Fundus Analysis</p>
        </div>
      </motion.div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <div className="aspect-square rounded-lg overflow-hidden mb-2">
            <img src={originalImage || fundusImage} alt="Original" className="w-full h-full object-cover" />
          </div>
          <p className="text-xs text-muted-foreground">Original</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="text-center"
        >
          <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-foreground/10">
            <img src={discMask} alt="Disc Mask" className="w-full h-full object-cover" />
          </div>
          <p className="text-xs text-muted-foreground">Optic Disc</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-foreground/10">
            <img src={cupMask} alt="Cup Mask" className="w-full h-full object-cover" />
          </div>
          <p className="text-xs text-muted-foreground">Optic Cup</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
          className="text-center"
        >
          <div className="aspect-square rounded-lg overflow-hidden mb-2">
            <img src={gradcamImage} alt="Grad-CAM" className="w-full h-full object-cover" />
          </div>
          <p className="text-xs text-muted-foreground">Grad-CAM</p>
        </motion.div>
      </div>

      {/* Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* CDR Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 bg-muted/30 rounded-xl"
        >
          <p className="text-sm text-muted-foreground mb-2">CDR Values</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Vertical CDR:</span>
              <span className={`font-semibold ${cdr.vertical > 0.6 ? 'text-destructive' : cdr.vertical > 0.5 ? 'text-warning' : 'text-success'}`}>
                {cdr.vertical.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Area CDR:</span>
              <span className={`font-semibold ${cdr.area > 0.6 ? 'text-destructive' : cdr.area > 0.5 ? 'text-warning' : 'text-success'}`}>
                {cdr.area.toFixed(2)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Classification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className={`p-4 rounded-xl ${isGlaucoma ? 'bg-destructive/10' : 'bg-success/10'}`}
        >
          <p className="text-sm text-muted-foreground mb-2">Classification</p>
          <div className="flex items-center gap-2">
            <Eye className={`w-5 h-5 ${isGlaucoma ? 'text-destructive' : 'text-success'}`} />
            <span className={`text-xl font-bold ${isGlaucoma ? 'text-destructive' : 'text-success'}`}>
              {prediction.label}
            </span>
          </div>
          <p className="text-sm mt-1">
            Confidence: <span className="font-semibold">{Math.round(prediction.prob * 100)}%</span>
          </p>
        </motion.div>

        {/* Model */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 bg-accent/30 rounded-xl"
        >
          <p className="text-sm text-muted-foreground mb-2">AI Model</p>
          <p className="font-medium text-foreground">InceptionV3 + CatBoost</p>
          <p className="text-xs text-muted-foreground mt-1">Hybrid CNN-ML Pipeline</p>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap gap-4"
      >
        <button
          onClick={handleDownloadPDF}
          className="medical-button flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download PDF Report
        </button>
        <button
          onClick={onReset}
          className="medical-button-outline flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset System
        </button>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-xl"
      >
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-warning">Disclaimer: </span>
          This is an AI-assisted screening tool for research purposes only. Results should be validated by 
          qualified ophthalmologists. This system is not intended for clinical diagnosis without professional review.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ReportPanel;
