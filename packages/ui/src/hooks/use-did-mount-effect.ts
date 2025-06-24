import { DependencyList, useEffect, useRef } from "react";

/**
 * Custom hook that runs a function only after the component has mounted.
 * Useful for avoiding hydration mismatches and ensuring client-side only execution.
 *
 * @param func - The function to execute after mount
 * @param deps - Optional dependency array to watch for changes
 */
export function useDidMountEffect(func: () => void, deps?: DependencyList) {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      func();
    } else {
      didMount.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
