import React, { useCallback, useRef, useImperativeHandle, forwardRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import StepContent from "./StepContent";

interface StepBottomSheetProps {
  steps: React.ComponentType[];
  onClose?: () => void;
  snapPoints?: string[];
  enablePanDownToClose?: boolean;
  enableDynamicSizing?: boolean;
  enableOverDrag?: boolean;
  index?: number;
  backgroundStyle?: any;
  handleIndicatorStyle?: any;
}

export interface StepBottomSheetRef {
  snapToIndex: (index: number) => void;
  close: () => void;
}

const StepBottomSheet = forwardRef<StepBottomSheetRef, StepBottomSheetProps>(({
  steps,
  onClose,
  snapPoints = ["100%"],
  enablePanDownToClose = true,
  enableDynamicSizing = true,
  enableOverDrag = false,
  index = -1,
  backgroundStyle,
  handleIndicatorStyle = { height: 0 },
}, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  useImperativeHandle(ref, () => ({
    snapToIndex: (index: number) => bottomSheetRef.current?.snapToIndex(index),
    close: () => bottomSheetRef.current?.close(),
  }));

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
    onClose?.();
  }, [onClose]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={handleClosePress}
      />
    ),
    [handleClosePress]
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheet
        snapPoints={snapPoints}
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        enablePanDownToClose={enablePanDownToClose}
        enableDynamicSizing={enableDynamicSizing}
        enableOverDrag={enableOverDrag}
        index={index}
        backgroundStyle={[styles.bottomSheetBackground, backgroundStyle]}
        style={styles.bottomSheetContainer}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={handleIndicatorStyle}
      >
        <BottomSheetView style={styles.bottomSheetView}>
          <TouchableOpacity
            style={styles.touchableContainer}
            onPress={handleClosePress}
            activeOpacity={1}
          >
            <View style={styles.innerContainer}>
              <StepContent steps={steps} onClose={handleClosePress} />
            </View>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gray",
  },
  bottomSheetContainer: {
    flex: 1,
  },
  bottomSheetBackground: {
    backgroundColor: "transparent",
  },
  bottomSheetView: {
    height: '100%',
  },
  touchableContainer: {
    width: '100%',
    height: '100%',
  },
  innerContainer: {
    padding: 24,
    paddingBottom: 24,
    width: '100%',
    height: '100%',
  },
});

StepBottomSheet.displayName = 'StepBottomSheet';

export default StepBottomSheet;