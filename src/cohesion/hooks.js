import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

export const IS_FULLY_SHOWN_THRESHOLD_OR_MARGIN = 1.0;
export const IS_SINGLE_PX_SHOWN_THRESHOLD_OR_MARGIN = 0.0;
export const DOCUMENT_ROOT_NODE = null;

const defaultOptions = {
  threshold: IS_FULLY_SHOWN_THRESHOLD_OR_MARGIN,
  root: DOCUMENT_ROOT_NODE,
};

/**
Hook to track if an element is intersecting with a root (null represents <html>).
@param callback The callback to be invoked when an item intersects.
@param options The options for IntersectionObserver.
 */
export const useIntersectionObserver = (callback, options = defaultOptions) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) { return; }
    const refCurrent = ref.current;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry);
        }
      });
    }, options);

    if (ref.current) {
      observer.observe(refCurrent);
    }

    // eslint-disable-next-line consistent-return
    return () => {
      if (refCurrent) {
        observer.unobserve(refCurrent);
      }
    };
  }, [callback, options]);

  return ref;
};

/**
Hook to track an element's intersection but only trigger callback once per element.
@param callback The callback to be invoked once the item is shown.
@param options Intersection observer options.
 */
export const useSingleCallIntersectionObserver = (callback, options = defaultOptions) => {
  const [hasBeenShown, setHasBeenShown] = useState(false);

  const handleVisibilityChange = useCallback((entry) => {
    if (!hasBeenShown) {
      callback(entry);
      setHasBeenShown(true);
    }
  }, [callback, hasBeenShown]);

  return useIntersectionObserver(handleVisibilityChange, options);
};

export default useSingleCallIntersectionObserver;
export const useIsShowing = useIntersectionObserver;
