import { ReactElement, useState } from "react";

export default function useMultiStepForm(steps: ReactElement[]) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  function next() {
    setCurrentStepIndex((current) => {
      if (current >= steps.length - 1) return current;
      return current + 1;
    });
  }

  function previous() {
    setCurrentStepIndex((current) => {
      if (current <= 0) return current;
      return current - 1;
    });
  }

  function goto(index: number) {
    setCurrentStepIndex(index);
  }

  return {
    steps,
    currentStepIndex,
    step: steps[currentStepIndex],
    goto,
    next,
    previous,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
  }
}
