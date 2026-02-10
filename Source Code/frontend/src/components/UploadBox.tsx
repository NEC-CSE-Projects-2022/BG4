import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image, X, FileImage } from 'lucide-react';

interface UploadBoxProps {
  onImageUpload: (files: File[], previews: string[]) => void;
  uploadedImages: string[];
  onClear: () => void;
}

const UploadBox = ({ onImageUpload, uploadedImages, onClear }: UploadBoxProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files && files.length > 0) {
      processFiles(files);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(Array.from(files));
    }
  };

  const processFiles = (files: File[]) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const validFiles = files.filter(file => validTypes.includes(file.type));
    
    if (validFiles.length === 0) {
      alert('Please upload only .jpg, .jpeg, or .png files');
      return;
    }

    if (validFiles.length < files.length) {
      alert(`${files.length - validFiles.length} file(s) were skipped due to invalid format`);
    }

    const readers = validFiles.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          resolve(result);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(previews => {
      onImageUpload(validFiles, previews);
    });
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!uploadedImages || uploadedImages.length === 0 ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-xl p-12
              transition-all duration-300 cursor-pointer
              ${isDragging 
                ? 'border-primary bg-accent scale-[1.02]' 
                : 'border-border hover:border-primary/50 hover:bg-accent/50'
              }
            `}
          >
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              multiple
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center gap-4 text-center">
              <motion.div
                animate={{ y: isDragging ? -10 : 0 }}
                transition={{ duration: 0.2 }}
                className={`
                  w-16 h-16 rounded-full flex items-center justify-center
                  ${isDragging ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                  transition-colors duration-300
                `}
              >
                <Upload className="w-8 h-8" />
              </motion.div>
              <div>
                <p className="text-lg font-medium text-foreground">
                  {isDragging ? 'Drop your images here' : 'Drag & drop your retinal fundus images'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse (multiple files supported)
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileImage className="w-4 h-4" />
                <span>Accepted formats: .jpg, .jpeg, .png</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative"
          >
            <div className="medical-card p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Image className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">Retinal Fundus Images ({uploadedImages.length})</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {uploadedImages.length} image(s) uploaded successfully. Ready for validation and analysis.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Uploaded fundus ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg shadow-md border border-border"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={onClear}
                    className="flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Remove and upload different images
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadBox;
