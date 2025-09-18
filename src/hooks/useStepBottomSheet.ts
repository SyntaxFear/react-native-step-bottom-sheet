import { useRef, useCallback } from 'react';

export const useStepBottomSheet = () => {
  const ref = useRef<any>(null);

  const open = useCallback(() => {
    ref.current?.snapToIndex(0);
  }, []);

  const close = useCallback(() => {
    ref.current?.close();
  }, []);

  return {
    ref,
    open,
    close,
  };
};