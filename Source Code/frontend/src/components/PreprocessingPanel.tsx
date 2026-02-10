import { motion } from 'framer-motion';
import { Maximize2, Contrast, Sparkles } from 'lucide-react';

interface PreprocessingPanelProps {
  originalImage: string;
}

const PreprocessingPanel = ({ originalImage }: PreprocessingPanelProps) => {
  const processingSteps = [
    {
      title: 'Resized (224×224)',
      icon: Maximize2,
      description: 'Image resized to model input dimensions',
      filter: 'none',
    },
    {
      title: 'Contrast Enhanced',
      icon: Contrast,
      description: 'CLAHE applied for better visibility',
      filter: 'contrast(1.3) saturate(1.2)',
    },
    {
      title: 'Normalized',
      icon: Sparkles,
      description: 'Pixel values normalized to [0,1]',
      filter: 'brightness(1.1) contrast(0.95)',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="medical-card p-6"
    >
      <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        Preprocessing Steps
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {processingSteps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            className="bg-muted/50 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <step.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium text-foreground">{step.title}</span>
            </div>
            <div className="aspect-square rounded-lg overflow-hidden bg-foreground/5 mb-3">
              <img
                src={originalImage}
                alt={step.title}
                className="w-full h-full object-cover"
                style={{ filter: step.filter }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PreprocessingPanel;
