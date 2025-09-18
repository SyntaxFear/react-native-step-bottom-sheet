import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  runOnJS
} from "react-native-reanimated";
import { StepContentProps } from "../types";

const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingVertical: 40,
    marginTop: 'auto',
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 32,
    width: '100%',
  },
  navButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
  },
  navButtonDisabled: {
    backgroundColor: "#E5E5E5",
  },
  navButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  navButtonTextDisabled: {
    color: "#999",
  },
  indicatorContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  stepIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E5E5E5",
    marginHorizontal: 4,
  },
  stepIndicatorActive: {
    backgroundColor: "#007AFF",
  },
});

const StepContent: React.FC<StepContentProps> = ({ 
  steps, 
  onClose,
  onStepChange,
  initialStep = 0,
  showNavigation = true,
  showIndicators = true,
  navigationLabels = { previous: 'Previous', next: 'Next' },
  styles = {}
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isAnimating, setIsAnimating] = useState(false);
  const [contentHeights, setContentHeights] = useState<number[]>([]);
  const opacity = useSharedValue(1);
  const height = useSharedValue(0);

  const updateStep = useCallback((newStep: number) => {
    setCurrentStep(newStep);
    setIsAnimating(false);
    onStepChange?.(newStep);
  }, [onStepChange]);

  const measureAllSteps = useCallback((stepIndex: number, measuredHeight: number) => {
    setContentHeights(prev => {
      const newHeights = [...prev];
      newHeights[stepIndex] = measuredHeight;
      
      if (stepIndex === initialStep && height.value === 0) {
        height.value = measuredHeight;
      }
      
      return newHeights;
    });
  }, [height, initialStep]);

  const handleNextStep = useCallback(() => {
    if (currentStep < steps.length - 1 && !isAnimating) {
      setIsAnimating(true);
      const nextStep = currentStep + 1;
      const nextHeight = contentHeights[nextStep];
      
      if (nextHeight) {
        height.value = withTiming(nextHeight, { duration: 300 });
      }
      
      opacity.value = withTiming(0, { duration: 150 }, () => {
        runOnJS(updateStep)(nextStep);
        opacity.value = withTiming(1, { duration: 150 });
      });
    }
  }, [currentStep, steps.length, opacity, height, contentHeights, updateStep, isAnimating]);

  const handlePreviousStep = useCallback(() => {
    if (currentStep > 0 && !isAnimating) {
      setIsAnimating(true);
      const prevStep = currentStep - 1;
      const prevHeight = contentHeights[prevStep];
      
      if (prevHeight) {
        height.value = withTiming(prevHeight, { duration: 300 });
      }
      
      opacity.value = withTiming(0, { duration: 150 }, () => {
        runOnJS(updateStep)(prevStep);
        opacity.value = withTiming(1, { duration: 150 });
      });
    }
  }, [currentStep, opacity, height, contentHeights, updateStep, isAnimating]);

  const CurrentStepComponent = steps[currentStep];

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const animatedHeightStyle = useAnimatedStyle(() => {
    return {
      height: height.value > 0 ? height.value : undefined,
    };
  });

  const mergedStyles = {
    container: { ...defaultStyles.container, ...styles.container },
    navigationContainer: { ...defaultStyles.navigationContainer },
    navButton: { ...defaultStyles.navButton, ...styles.navigationButton },
    navButtonDisabled: { ...defaultStyles.navButtonDisabled, ...styles.navigationButtonDisabled },
    navButtonText: { ...defaultStyles.navButtonText, ...styles.navigationButtonText },
    navButtonTextDisabled: { ...defaultStyles.navButtonTextDisabled, ...styles.navigationButtonTextDisabled },
    indicatorContainer: { ...defaultStyles.indicatorContainer },
    stepIndicator: { ...defaultStyles.stepIndicator, ...styles.stepIndicator },
    stepIndicatorActive: { ...defaultStyles.stepIndicatorActive, ...styles.stepIndicatorActive },
  };

  return (
    <TouchableOpacity 
      style={mergedStyles.container}
      onPress={(e) => e.stopPropagation()}
      activeOpacity={1}
    >
      {steps.map((StepComponent, index) => (
        <View
          key={index}
          style={{
            position: 'absolute',
            opacity: 0,
            pointerEvents: 'none',
            left: -9999,
          }}
          onLayout={(event) => {
            const { height: measuredHeight } = event.nativeEvent.layout;
            measureAllSteps(index, measuredHeight);
          }}
        >
          <StepComponent />
        </View>
      ))}
      
      <Animated.View style={[animatedHeightStyle, { overflow: 'hidden' }]}>
        <Animated.View style={animatedStyle}>
          <CurrentStepComponent />
        </Animated.View>
      </Animated.View>
      
      {showNavigation && (
        <View style={mergedStyles.navigationContainer}>
          <TouchableOpacity
            style={[
              mergedStyles.navButton,
              currentStep === 0 && mergedStyles.navButtonDisabled,
            ]}
            onPress={handlePreviousStep}
            disabled={currentStep === 0}
          >
            <Text
              style={[
                mergedStyles.navButtonText,
                currentStep === 0 && mergedStyles.navButtonTextDisabled,
              ]}
            >
              {navigationLabels.previous}
            </Text>
          </TouchableOpacity>

          {showIndicators && (
            <View style={mergedStyles.indicatorContainer}>
              {steps.map((_, index) => (
                <View
                  key={index}
                  style={[
                    mergedStyles.stepIndicator,
                    index === currentStep && mergedStyles.stepIndicatorActive,
                  ]}
                />
              ))}
            </View>
          )}

          <TouchableOpacity
            style={[
              mergedStyles.navButton,
              currentStep === steps.length - 1 && mergedStyles.navButtonDisabled,
            ]}
            onPress={handleNextStep}
            disabled={currentStep === steps.length - 1}
          >
            <Text
              style={[
                mergedStyles.navButtonText,
                currentStep === steps.length - 1 && mergedStyles.navButtonTextDisabled,
              ]}
            >
              {navigationLabels.next}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default StepContent;