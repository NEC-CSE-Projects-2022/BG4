import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Layers } from 'lucide-react';
import gradcamImage from '@/assets/gradcam.png';
import fundusImage from '@/assets/fundus_sample.jpg';

interface ExplainabilityPanelProps {
  originalImage?: string;
}

const ExplainabilityPanel = ({ originalImage }: ExplainabilityPanelProps) => {
  const [activeMethod, setActiveMethod] = useState<'gradcam' | 'gradcam++'>('gradcam');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="medical-card p-6"
    >
      <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <Eye className="w-5 h-5 text-primary" />
        Explainability (Grad-CAM)
      </h3>

      {/* Toggle Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveMethod('gradcam')}
          className={`
            px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
            ${activeMethod === 'gradcam'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }
          `}
        >
          Grad-CAM
        </button>
        <button
          onClick={() => setActiveMethod('gradcam++')}
          className={`
            px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
            ${activeMethod === 'gradcam++'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }
          `}
        >
          Grad-CAM++
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-muted/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Original Image</span>
          </div>
          <div className="aspect-square rounded-lg overflow-hidden">
            <img
              src={originalImage || fundusImage}
              alt="Original fundus"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Heatmap */}
        <motion.div
          key={activeMethod}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-muted/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {activeMethod === 'gradcam' ? 'Grad-CAM' : 'Grad-CAM++'} Heatmap
            </span>
          </div>
          <div className="aspect-square rounded-lg overflow-hidden relative">
            <img
              src={gradcamImage}
              alt="Grad-CAM heatmap"
              className="w-full h-full object-cover"
              style={{
                filter: activeMethod === 'gradcam++' ? 'hue-rotate(20deg) saturate(1.2)' : 'none'
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-4 bg-accent/30 rounded-xl"
      >
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {activeMethod === 'gradcam' ? 'Grad-CAM: ' : 'Grad-CAM++: '}
          </span>
          {activeMethod === 'gradcam'
            ? 'Gradient-weighted Class Activation Mapping highlights regions the model focuses on for classification. Warmer colors (red/yellow) indicate higher importance.'
            : 'An improved version of Grad-CAM that provides better localization for multiple instances and handles visual explanations more robustly.'
          }
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ExplainabilityPanel;
