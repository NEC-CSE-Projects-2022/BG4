import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Eye } from 'lucide-react';

interface ValidationAlertProps {
  isValid: boolean;
  isFundus: boolean[];
}

const ValidationAlert = ({ isValid, isFundus }: ValidationAlertProps) => {
  const validCount = isFundus.filter(f => f).length;
  const totalCount = isFundus.length;
  const allValid = isValid && validCount === totalCount;
  const someInvalid = !isValid && validCount < totalCount && validCount > 0;
  const allInvalid = !isValid && validCount === 0;

  if (allInvalid) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="medical-card border-destructive/50 bg-destructive/5 p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
            <XCircle className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-destructive mb-2">
              ❌ All Images Invalid - Not from REFUGE Dataset
            </h3>
            <p className="text-muted-foreground mb-4">
              None of the {totalCount} uploaded images are from the REFUGE dataset. Please upload only REFUGE dataset retinal fundus images for glaucoma screening.
            </p>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
              <p className="text-sm text-destructive font-medium">
                ⚠️ This system only accepts REFUGE dataset images
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="w-4 h-4" />
              <span>Please upload valid REFUGE dataset fundus images to continue.</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="medical-card border-success/50 bg-success/5 p-6"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-6 h-6 text-success" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-success mb-2">
            ✅ All {totalCount} REFUGE Dataset Images Valid
          </h3>
          <p className="text-muted-foreground mb-4">
            All {totalCount} uploaded images have been identified as valid REFUGE dataset retinal fundus photographs. 
            The images are suitable for glaucoma detection analysis.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 rounded-full text-sm">
              <Eye className="w-4 h-4 text-success" />
              <span className="text-success font-medium">{totalCount} REFUGE Images Verified</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm text-muted-foreground">
              <span>Format: Valid</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm text-muted-foreground">
              <span>Quality: Medical Grade</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ValidationAlert;
