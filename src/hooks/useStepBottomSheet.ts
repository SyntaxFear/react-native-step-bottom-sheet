import { useRef, useState, useCallback } from 'react';
import { UseStepBottomSheetReturn } from '../types';

export const useStepBottomSheet = (): UseStepBottomSheetReturn => {
  const ref = useRef<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    ref.current?.open();
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    ref.current?.close();
    setIsOpen(false);
    setCurrentStep(0);
  }, []);

  const goToStep = useCallback((stepIndex: number) => {
    setCurrentStep(stepIndex);
  }, []);

  return {
    ref,
    open,
    close,
    goToStep,
    currentStep,
    isOpen,
  };
};