import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { BottomSheetProps } from '@gorhom/bottom-sheet';

export interface StepContentProps {
  steps: React.ComponentType[];
  onClose?: () => void;
  onStepChange?: (stepIndex: number) => void;
  initialStep?: number;
  showNavigation?: boolean;
  showIndicators?: boolean;
  navigationLabels?: {
    previous: string;
    next: string;
  };
  styles?: {
    container?: ViewStyle;
    navigationButton?: ViewStyle;
    navigationButtonDisabled?: ViewStyle;
    navigationButtonText?: TextStyle;
    navigationButtonTextDisabled?: TextStyle;
    stepIndicator?: ViewStyle;
    stepIndicatorActive?: ViewStyle;
  };
}

export interface StepBottomSheetProps extends Partial<BottomSheetProps> {
  steps: React.ComponentType[];
  isVisible?: boolean;
  onClose?: () => void;
  onStepChange?: (stepIndex: number) => void;
  stepContentProps?: Partial<StepContentProps>;
  containerStyle?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  backdropProps?: any;
}

export interface UseStepBottomSheetReturn {
  ref: React.RefObject<any>;
  open: () => void;
  close: () => void;
  goToStep: (stepIndex: number) => void;
  currentStep: number;
  isOpen: boolean;
}