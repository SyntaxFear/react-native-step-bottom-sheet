import React, { useCallback, useRef, useImperativeHandle, forwardRef } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import StepContent from "./StepContent";
import { StepBottomSheetProps } from "../types";

const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSheetContainer: {
    flex: 1,
  },
  bottomSheetBackground: {
    backgroundColor: "transparent",
  },
  contentContainer: {
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

export interface StepBottomSheetRef {
  open: () => void;
  close: () => void;
  snapToIndex: (index: number) => void;
}

const StepBottomSheet = forwardRef<StepBottomSheetRef, StepBottomSheetProps>(({
  steps,
  isVisible = false,
  onClose,
  onStepChange,
  stepContentProps = {},
  containerStyle,
  contentContainerStyle,
  backdropProps = {},
  snapPoints = ["100%"],
  enablePanDownToClose = true,
  enableDynamicSizing = true,
  enableOverDrag = false,
  index = -1,
  backgroundStyle,
  handleIndicatorStyle = { height: 0 },
  onChange,
  ...bottomSheetProps
}, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  useImperativeHandle(ref, () => ({
    open: () => bottomSheetRef.current?.snapToIndex(0),
    close: () => bottomSheetRef.current?.close(),
    snapToIndex: (index: number) => bottomSheetRef.current?.snapToIndex(index),
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
        {...backdropProps}
      />
    ),
    [handleClosePress, backdropProps]
  );

  const mergedStyles = {
    bottomSheetBackground: StyleSheet.flatten([defaultStyles.bottomSheetBackground, backgroundStyle]),
    contentContainer: StyleSheet.flatten([defaultStyles.contentContainer, contentContainerStyle]),
  };

  return (
    <BottomSheet
      snapPoints={snapPoints}
      ref={bottomSheetRef}
      onChange={onChange || handleSheetChanges}
      enablePanDownToClose={enablePanDownToClose}
      enableDynamicSizing={enableDynamicSizing}
      enableOverDrag={enableOverDrag}
      index={index}
      backgroundStyle={mergedStyles.bottomSheetBackground}
      style={defaultStyles.bottomSheetContainer}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={handleIndicatorStyle}
    >
      <BottomSheetView style={mergedStyles.contentContainer}>
        <TouchableOpacity
          style={defaultStyles.touchableContainer}
          onPress={handleClosePress}
          activeOpacity={1}
        >
          <View style={defaultStyles.innerContainer}>
            <StepContent 
              steps={steps} 
              onClose={handleClosePress}
              onStepChange={onStepChange}
              {...stepContentProps}
            />
          </View>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
});

StepBottomSheet.displayName = 'StepBottomSheet';

export default StepBottomSheet;