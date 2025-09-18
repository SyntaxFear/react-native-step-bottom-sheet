# React Native Step Bottom Sheet

A customizable step-by-step bottom sheet component for React Native with smooth animations, perfect for onboarding flows, wizards, and multi-step forms.

## Features

- 🎯 **Step-by-step navigation** with smooth animations
- 🎨 **Fully customizable** styling and behavior
- 📱 **Built on @gorhom/bottom-sheet** for reliable performance
- ⚡ **Dynamic height adjustment** based on content
- 🎭 **Animated transitions** between steps
- 🎮 **Gesture support** with pan-to-close functionality
- 🔧 **TypeScript support** with full type definitions
- 🎪 **Flexible step components** - use any React component as a step

## Installation

```bash
npm install react-native-step-bottom-sheet
# or
yarn add react-native-step-bottom-sheet
```

### Peer Dependencies

Make sure you have these peer dependencies installed:

```bash
npm install @gorhom/bottom-sheet react-native-gesture-handler react-native-reanimated react-native-safe-area-context
# or
yarn add @gorhom/bottom-sheet react-native-gesture-handler react-native-reanimated react-native-safe-area-context
```

## Quick Start

### App Setup

**Important:** Before using the component, you need to set up the required providers in your app's root layout.

#### For Expo Router Apps

Add the providers to your `app/_layout.tsx`:

```tsx
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Slot />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
```

#### For React Navigation Apps

Add the providers to your `App.tsx` or root component:

```tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import YourNavigator from './YourNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <BottomSheetModalProvider>
          <YourNavigator />
        </BottomSheetModalProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
```

### Basic Usage

```tsx
import React, { useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import { StepBottomSheet } from 'react-native-step-bottom-sheet';

// Define your step components
const WelcomeStep = () => (
  <View style={{ padding: 20 }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Welcome! 🎉</Text>
    <Text>Get started with our amazing app</Text>
  </View>
);

const SetupStep = () => (
  <View style={{ padding: 20 }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Setup 🔧</Text>
    <Text>Let's configure your preferences</Text>
  </View>
);

const ReadyStep = () => (
  <View style={{ padding: 20 }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Ready! 🚀</Text>
    <Text>You're all set to begin</Text>
  </View>
);

const App = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const steps = [WelcomeStep, SetupStep, ReadyStep];

  const handleOpenPress = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "gray" }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity onPress={handleOpenPress}>
          <Text>Open</Text>
        </TouchableOpacity>
      </View>
      <StepBottomSheet
        ref={bottomSheetRef}
        steps={steps}
        onClose={handleClosePress}
      />
    </GestureHandlerRootView>
  );
};
```

### Advanced Usage with Custom Styling

```tsx
import React from 'react';
import { View, Button } from 'react-native';
import { StepBottomSheet, useStepBottomSheet } from 'react-native-step-bottom-sheet';

const App = () => {
  const { ref, open, close, currentStep } = useStepBottomSheet();
  
  const handleStepChange = (stepIndex: number) => {
    console.log('Current step:', stepIndex);
  };

  return (
    <View style={{ flex: 1 }}>
      <Button title="Open Custom Steps" onPress={open} />
      
      <StepBottomSheet
        ref={ref}
        steps={[WelcomeStep, SetupStep, ReadyStep]}
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
              backgroundColor: '#f8f9fa',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
            navigationButton: {
              backgroundColor: '#007AFF',
              borderRadius: 12,
            },
            stepIndicatorActive: {
              backgroundColor: '#007AFF',
            }
          }
        }}
        snapPoints={['90%']}
        enablePanDownToClose={true}
        backdropProps={{
          opacity: 0.5,
        }}
      />
    </View>
  );
};
```

## API Reference

### StepBottomSheet Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `React.ComponentType[]` | **Required** | Array of React components to render as steps |
| `onClose` | `() => void` | `undefined` | Callback when bottom sheet is closed |
| `onStepChange` | `(stepIndex: number) => void` | `undefined` | Callback when step changes |
| `stepContentProps` | `Partial<StepContentProps>` | `{}` | Props to pass to the StepContent component |
| `snapPoints` | `string[]` | `["100%"]` | Bottom sheet snap points |
| `enablePanDownToClose` | `boolean` | `true` | Enable pan down to close gesture |
| `enableDynamicSizing` | `boolean` | `true` | Enable dynamic sizing based on content |
| `backdropProps` | `object` | `{}` | Props for the backdrop component |

### StepContentProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `React.ComponentType[]` | **Required** | Array of step components |
| `onClose` | `() => void` | `undefined` | Close callback |
| `onStepChange` | `(stepIndex: number) => void` | `undefined` | Step change callback |
| `initialStep` | `number` | `0` | Initial step index |
| `showNavigation` | `boolean` | `true` | Show navigation buttons |
| `showIndicators` | `boolean` | `true` | Show step indicators |
| `navigationLabels` | `{previous: string, next: string}` | `{previous: 'Previous', next: 'Next'}` | Navigation button labels |
| `styles` | `object` | `{}` | Custom styles object |

### useStepBottomSheet Hook

Returns an object with:

| Property | Type | Description |
|----------|------|-------------|
| `ref` | `RefObject` | Ref to pass to StepBottomSheet |
| `open` | `() => void` | Function to open the bottom sheet |
| `close` | `() => void` | Function to close the bottom sheet |
| `goToStep` | `(stepIndex: number) => void` | Function to navigate to specific step |
| `currentStep` | `number` | Current step index |
| `isOpen` | `boolean` | Whether the bottom sheet is open |

## Styling

The component supports extensive styling customization through the `styles` prop in `stepContentProps`:

```tsx
const customStyles = {
  container: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  navigationButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  navigationButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },
  navigationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  navigationButtonTextDisabled: {
    color: '#999',
  },
  stepIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E5E5E5',
  },
  stepIndicatorActive: {
    backgroundColor: '#007AFF',
  },
};
```

## Examples

Check out the `/example` folder for complete working examples including:

- Basic step navigation
- Custom styling
- Dynamic content
- Integration with forms
- Onboarding flows

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## License

MIT License - see LICENSE file for details.

## Credits

Built on top of the excellent [@gorhom/bottom-sheet](https://github.com/gorhom/react-native-bottom-sheet) library.