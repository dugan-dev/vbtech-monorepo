import { DependencyList, useEffect, useRef } from "react";

/**
 * A hook that runs an effect only after the component has mounted (skips the first render).
 * @param func - The function to run
 * @param deps - Dependency array for the effect
 */
export const useDidMountEffect = (
  func: () => void,
  deps: DependencyList | undefined,
) => {
  const didMount = useRef(false);

  // Effect 1: Track mount state (runs once)
  useEffect(() => {
    didMount.current = true;
  }, []);

  // Effect 2: Run the actual effect (only after mount)
  useEffect(() => {
    if (didMount.current) func();
    // Note: func is intentionally not in deps to maintain the original API design
    // where callers provide their own dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
