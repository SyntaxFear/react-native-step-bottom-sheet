import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { StepBottomSheet, useStepBottomSheet } from '../src';

// Example step components
const WelcomeStep = () => (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Welcome to Our App! 🎉</Text>
    <Text style={styles.stepSubtitle}>Get started with amazing features</Text>
    
    <View style={styles.contentList}>
      <Text style={styles.contentItem}>• Discover new possibilities</Text>
      <Text style={styles.contentItem}>• Connect with friends</Text>
      <Text style={styles.contentItem}>• Share your moments</Text>
      <Text style={styles.contentItem}>• Explore trending content</Text>
      <Text style={styles.contentItem}>• Customize your experience</Text>
    </View>
  </View>
);

const SetupStep = () => (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Let's Set You Up! ⚙️</Text>
    <Text style={styles.stepSubtitle}>Configure your preferences</Text>
    
    <View style={styles.contentList}>
      <Text style={styles.contentItem}>• Choose your interests</Text>
      <Text style={styles.contentItem}>• Set notification preferences</Text>
      <Text style={styles.contentItem}>• Connect your accounts</Text>
      <Text style={styles.contentItem}>• Customize your profile</Text>
    </View>
  </View>
);

const ReadyStep = () => (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>You're All Set! 🚀</Text>
    <Text style={styles.stepSubtitle}>Ready to begin your journey</Text>
    
    <View style={styles.contentList}>
      <Text style={styles.contentItem}>• Your profile is complete</Text>
      <Text style={styles.contentItem}>• Notifications are configured</Text>
      <Text style={styles.contentItem}>• You're ready to explore</Text>
      <Text style={styles.contentItem}>• Start discovering content</Text>
    </View>
  </View>
);

const ExampleApp = () => {
  const { ref, open, close, currentStep } = useStepBottomSheet();
  const steps = [WelcomeStep, SetupStep, ReadyStep];

  const handleStepChange = (stepIndex: number) => {
    console.log('Current step:', stepIndex);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Step Bottom Sheet Example</Text>
        <Text style={styles.subtitle}>
          Tap the button below to see the step-by-step bottom sheet in action
        </Text>
        
        <TouchableOpacity style={styles.openButton} onPress={open}>
          <Text style={styles.openButtonText}>Open Step Flow</Text>
        </TouchableOpacity>
        
        {currentStep > 0 && (
          <Text style={styles.currentStepText}>
            Current Step: {currentStep + 1} of {steps.length}
          </Text>
        )}
      </View>

      <StepBottomSheet
        ref={ref}
        steps={steps}
        onClose={close}
        onStepChange={handleStepChange}
        stepContentProps={{
          initialStep: 0,
          showNavigation: true,
          showIndicators: true,
          navigationLabels: {
            previous: 'Back',
            next: 'Continue'
          },
          styles: {
            container: {
              backgroundColor: '#ffffff',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            },
            navigationButton: {
              backgroundColor: '#007AFF',
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 12,
            },
            navigationButtonText: {
              fontSize: 16,
              fontWeight: '600',
            },
            stepIndicatorActive: {
              backgroundColor: '#007AFF',
              width: 10,
              height: 10,
            },
          }
        }}
        snapPoints={['85%']}
        enablePanDownToClose={true}
        backdropProps={{
          opacity: 0.6,
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  openButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  openButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  currentStepText: {
    marginTop: 20,
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  stepContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  contentList: {
    marginTop: 24,
    width: '100%',
  },
  contentItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    lineHeight: 24,
  },
});

export default ExampleApp;