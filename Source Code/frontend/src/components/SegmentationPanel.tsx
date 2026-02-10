import { motion } from 'framer-motion';
import { Layers, Circle, Target } from 'lucide-react';
import fundusImage from '@/assets/fundus_sample.jpg';
import discMask from '@/assets/disc_mask.png';
import cupMask from '@/assets/cup_mask.png';

interface SegmentationPanelProps {
  originalImage?: string;
}

const SegmentationPanel = ({ originalImage }: SegmentationPanelProps) => {
  const segments = [
    {
      title: 'Original Image',
      icon: Layers,
      image: originalImage || fundusImage,
      description: 'Input retinal fundus photograph',
      color: 'primary',
    },
    {
      title: 'Optic Disc Mask',
      icon: Circle,
      image: discMask,
      description: 'Segmented optic disc region',
      color: 'warning',
    },
    {
      title: 'Optic Cup Mask',
      icon: Target,
      image: cupMask,
      description: 'Segmented optic cup region',
      color: 'success',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="medical-card p-6"
    >
      <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <Layers className="w-5 h-5 text-primary" />
        Segmentation Results
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {segments.map((segment, index) => (
          <motion.div
            key={segment.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2 }}
            className="group"
          >
            <div className={`
              bg-muted/50 rounded-xl p-4 border-2 border-transparent
              hover:border-${segment.color}/30 transition-all duration-300
            `}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg bg-${segment.color}/10 flex items-center justify-center`}>
                  <segment.icon className={`w-4 h-4 text-${segment.color}`} />
                </div>
                <span className="font-medium text-foreground">{segment.title}</span>
              </div>
              <div className="aspect-square rounded-lg overflow-hidden bg-foreground/10 mb-3 relative">
                <img
                  src={segment.image}
                  alt={segment.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <p className="text-xs text-muted-foreground">{segment.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 p-4 bg-accent/50 rounded-lg"
      >
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Model: </span>
          U-Net based architecture with attention mechanisms for precise optic disc and cup segmentation.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default SegmentationPanel;
