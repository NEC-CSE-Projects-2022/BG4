import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  name: string;
  shortName: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

const Stepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex items-center justify-between min-w-max px-4">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isPending = currentStep < step.id;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                    transition-all duration-300 shadow-sm
                    ${isCompleted ? 'bg-success text-success-foreground' : ''}
                    ${isActive ? 'bg-primary text-primary-foreground ring-4 ring-primary/30' : ''}
                    ${isPending ? 'bg-muted text-muted-foreground' : ''}
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </motion.div>
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    mt-2 text-xs font-medium text-center max-w-[80px]
                    ${isActive ? 'text-primary' : ''}
                    ${isCompleted ? 'text-success' : ''}
                    ${isPending ? 'text-muted-foreground' : ''}
                  `}
                >
                  {step.shortName}
                </motion.span>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2 min-w-[40px]">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isCompleted ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    className="h-1 bg-success rounded-full origin-left"
                    style={{ transformOrigin: 'left' }}
                  />
                  <div className={`h-1 -mt-1 rounded-full ${isCompleted ? 'bg-success' : 'bg-muted'}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
