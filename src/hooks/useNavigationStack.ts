import { useState, useCallback } from 'react';
import { Step } from '@/types/step';

export interface NavigationStep extends Step {
  timestamp: number;
}

export const useNavigationStack = (initialStep: Step = { num: 0, option: 'A' }) => {
  const [navigationStack, setNavigationStack] = useState<NavigationStep[]>([
    { ...initialStep, timestamp: Date.now() }
  ]);

  const pushStep = useCallback((step: Step) => {
    const navigationStep: NavigationStep = {
      ...step,
      timestamp: Date.now()
    };
    
    setNavigationStack(prev => [...prev, navigationStep]);
  }, []);

  const canGoBack = useCallback(() => {
    return navigationStack.length > 1;
  }, [navigationStack.length]);

  const goBack = useCallback(() => {
    if (!canGoBack()) return null;
    
    setNavigationStack(prev => prev.slice(0, -1));
    return navigationStack[navigationStack.length - 2];
  }, [navigationStack, canGoBack]);

  const getCurrentStep = useCallback(() => {
    return navigationStack[navigationStack.length - 1];
  }, [navigationStack]);

  const getPreviousStep = useCallback(() => {
    if (navigationStack.length < 2) return null;
    return navigationStack[navigationStack.length - 2];
  }, [navigationStack]);

  const resetNavigation = useCallback((step: Step = { num: 0, option: 'A' }) => {
    setNavigationStack([{ ...step, timestamp: Date.now() }]);
  }, []);

  const getNavigationPath = useCallback(() => {
    return navigationStack.map(step => `${step.num}:${step.option}`).join(' → ');
  }, [navigationStack]);

  return {
    navigationStack,
    currentStep: getCurrentStep(),
    previousStep: getPreviousStep(),
    canGoBack: canGoBack(),
    pushStep,
    goBack,
    resetNavigation,
    getNavigationPath
  };
};