import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  runOnJS
} from "react-native-reanimated";

interface StepContentProps {
  steps: React.ComponentType[];
  onClose?: () => void;
}

const StepContent: React.FC<StepContentProps> = ({ steps, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [contentHeights, setContentHeights] = useState<number[]>([]);
  const opacity = useSharedValue(1);
  const height = useSharedValue(0);

  const updateStep = useCallback((newStep: number) => {
    setCurrentStep(newStep);
    setIsAnimating(false);
  }, []);

  const measureAllSteps = useCallback((stepIndex: number, measuredHeight: number) => {
    setContentHeights(prev => {
      const newHeights = [...prev];
      newHeights[stepIndex] = measuredHeight;
      
      if (stepIndex === 0 && height.value === 0) {
        height.value = measuredHeight;
      }
      
      return newHeights;
    });
  }, [height]);

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

  return (
    <TouchableOpacity 
      style={styles.container}
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
      
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentStep === 0 && styles.navButtonDisabled,
          ]}
          onPress={handlePreviousStep}
          disabled={currentStep === 0}
        >
          <Text
            style={[
              styles.navButtonText,
              currentStep === 0 && styles.navButtonTextDisabled,
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        <View style={styles.indicatorContainer}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.stepIndicator,
                index === currentStep && styles.stepIndicatorActive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.navButton,
            currentStep === steps.length - 1 && styles.navButtonDisabled,
          ]}
          onPress={handleNextStep}
          disabled={currentStep === steps.length - 1}
        >
          <Text
            style={[
              styles.navButtonText,
              currentStep === steps.length - 1 && styles.navButtonTextDisabled,
            ]}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
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
  indicatorContainer: {
    flexDirection: 'row',
    gap: 8,
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

export default StepContent;