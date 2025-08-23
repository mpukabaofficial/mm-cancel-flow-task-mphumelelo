interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onChangeStep?: (step: number) => void;
  completed?: boolean;
}

//TODO: Implement change step

export default function StepIndicator({
  currentStep,
  totalSteps,
  completed = false,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center space-x-2">
      {/* Pills */}
      <div className="flex space-x-2">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepNumber = i + 1;
          let color = "bg-gray-200"; // default upcoming

          if (completed) {
            color = "bg-green-500"; // all green when completed
          } else if (stepNumber < currentStep) {
            color = "bg-green-500"; // completed
          } else if (stepNumber === currentStep) {
            color = "bg-gray-400"; // current
          }

          return (
            <div
              key={i}
              className={`h-2 w-6 rounded-full transition-colors duration-200 ${color}`}
            />
          );
        })}
      </div>

      {/* Label */}
      <span className="text-sm text-gray-600">
        {completed ? "Completed" : `Step ${currentStep} of ${totalSteps}`}
      </span>
    </div>
  );
}
