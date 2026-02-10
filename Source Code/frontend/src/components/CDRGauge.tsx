import { motion } from 'framer-motion';
import { Activity, TrendingUp } from 'lucide-react';

interface CDRGaugeProps {
  verticalCDR: number;
  areaCDR: number;
}

const CDRGauge = ({ verticalCDR, areaCDR }: CDRGaugeProps) => {
  const getColorClass = (value: number) => {
    if (value < 0.5) return 'text-success';
    if (value <= 0.6) return 'text-warning';
    return 'text-destructive';
  };

  const getStatusText = (value: number) => {
    if (value < 0.5) return 'Normal';
    if (value <= 0.6) return 'At Risk';
    return 'Glaucoma Suspect';
  };

  const getGradient = (value: number) => {
    if (value < 0.5) return 'from-success to-success/60';
    if (value <= 0.6) return 'from-warning to-warning/60';
    return 'from-destructive to-destructive/60';
  };

  const GaugeRing = ({ value, label }: { value: number; label: string }) => {
    const percentage = Math.min(value * 100, 100);
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32">
          {/* Background circle */}
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="45"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="45"
              fill="none"
              stroke={value < 0.5 ? 'hsl(var(--success))' : value <= 0.6 ? 'hsl(var(--warning))' : 'hsl(var(--destructive))'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </svg>
          {/* Center value */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className={`text-2xl font-bold ${getColorClass(value)}`}
            >
              {value.toFixed(2)}
            </motion.span>
          </div>
        </div>
        <div className="mt-3 text-center">
          <p className="font-medium text-foreground">{label}</p>
          <p className={`text-sm font-medium ${getColorClass(value)}`}>
            {getStatusText(value)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="medical-card p-6"
    >
      <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <Activity className="w-5 h-5 text-primary" />
        Cup-to-Disc Ratio (CDR)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GaugeRing value={verticalCDR} label="Vertical CDR" />
        <GaugeRing value={areaCDR} label="Area CDR" />
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 p-4 bg-muted/50 rounded-xl"
      >
        <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          CDR Interpretation Guide
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-xs text-muted-foreground">&lt; 0.5: Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <span className="text-xs text-muted-foreground">0.5–0.6: At Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span className="text-xs text-muted-foreground">&gt; 0.6: Glaucoma</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CDRGauge;
