import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const STEPS = ["Generales", "Tomador", "Coberturas", "Cláusulas", "Envío"];

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8 font-sans">
      {STEPS.map((label, i) => {
        const isCompleted = i < currentStep;
        const isActive = i === currentStep;
        return (
          <div key={label} className="flex items-center gap-1 sm:gap-2">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
                className={cn(
                  "w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-semibold shadow-sm",
                  isCompleted && "bg-[hsl(var(--step-completed))] text-white",
                  isActive && "bg-[hsl(var(--step-active))] text-primary-foreground",
                  !isCompleted && !isActive && "bg-[hsl(var(--step-pending))] text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : i + 1}
              </motion.div>
              <span
                className={cn(
                  "text-[10px] sm:text-xs font-medium",
                  isActive && "text-primary font-semibold",
                  isCompleted && "text-[hsl(var(--step-completed))]",
                  !isActive && !isCompleted && "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted
                    ? "hsl(var(--step-completed))"
                    : "hsl(var(--step-pending))",
                }}
                className="w-6 sm:w-12 h-0.5 mb-5 rounded-full"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
