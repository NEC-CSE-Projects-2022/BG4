import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Image as ImageIcon } from 'lucide-react';

interface SampleImagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SampleImagesModal = ({ isOpen, onClose }: SampleImagesModalProps) => {
  const sampleImages = [
    'T0001.jpg', 'T0002.jpg', 'T0003.jpg', 'T0004.jpg', 'T0005.jpg',
    'T0006.jpg', 'T0007.jpg', 'T0008.jpg'
  ];

  const handleDownload = (imageName: string) => {
    const link = document.createElement('a');
    link.href = `/REFUGE_dataset/test/Images/${imageName}`;
    link.download = imageName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageClick = (imageName: string) => {
    const link = document.createElement('a');
    link.href = `/REFUGE_dataset/test/Images/${imageName}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-background rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                REFUGE Dataset Sample Images
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Click on any image to view or use the download button to save it
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Images Grid */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {sampleImages.map((imageName, index) => (
                <motion.div
                  key={imageName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer">
                    <img
                      src={`/REFUGE_dataset/test/Images/${imageName}`}
                      alt={`Sample ${imageName}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onClick={() => handleImageClick(imageName)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-family='sans-serif' font-size='14'%3EImage not found%3C/text%3E%3C/svg%3E`;
                      }}
                    />
                  </div>
                  
                  {/* Image Info */}
                  <div className="mt-2 text-center">
                    <p className="text-xs text-muted-foreground truncate">{imageName}</p>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownload(imageName)}
                    className="absolute top-2 right-2 p-2 bg-background/90 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary hover:text-primary-foreground"
                    title="Download image"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SampleImagesModal;
