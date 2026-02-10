import { motion } from 'framer-motion';
import { Brain, AlertTriangle, CheckCircle, Cpu } from 'lucide-react';

interface ClassificationCardProps {
  prediction: string;
  probability: number;
  model: string;
}

const ClassificationCard = ({ prediction, probability, model }: ClassificationCardProps) => {
  const isGlaucoma = prediction.toLowerCase() === 'glaucoma';
  const percentage = Math.round(probability * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="medical-card p-6"
    >
      <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <Brain className="w-5 h-5 text-primary" />
        Classification Result
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prediction Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`
            p-6 rounded-xl border-2
            ${isGlaucoma 
              ? 'bg-destructive/5 border-destructive/30' 
              : 'bg-success/5 border-success/30'
            }
          `}
        >
          <div className="flex items-center gap-3 mb-4">
            {isGlaucoma ? (
              <AlertTriangle className="w-8 h-8 text-destructive" />
            ) : (
              <CheckCircle className="w-8 h-8 text-success" />
            )}
            <div>
              <p className="text-sm text-muted-foreground">Prediction</p>
              <p className={`text-2xl font-bold ${isGlaucoma ? 'text-destructive' : 'text-success'}`}>
                {prediction}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Probability Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-xl bg-muted/50"
        >
          <p className="text-sm text-muted-foreground mb-2">Confidence Score</p>
          <div className="flex items-end gap-2 mb-4">
            <span className={`text-4xl font-bold ${isGlaucoma ? 'text-destructive' : 'text-success'}`}>
              {percentage}
            </span>
            <span className="text-xl text-muted-foreground mb-1">%</span>
          </div>
          
          {/* Progress bar */}
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full ${isGlaucoma ? 'bg-destructive' : 'bg-success'}`}
            />
          </div>
        </motion.div>
      </div>

      {/* Model Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-accent/30 rounded-xl flex items-center gap-3"
      >
        <Cpu className="w-5 h-5 text-primary" />
        <div>
          <p className="text-sm font-medium text-foreground">Classification Model</p>
          <p className="text-xs text-muted-foreground">{model}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ClassificationCard;
