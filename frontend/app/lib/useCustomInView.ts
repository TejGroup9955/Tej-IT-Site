import { useEffect, useState, useRef } from 'react';

export function useCustomInView(
  ref: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit & { once?: boolean } = {}
) {
  const [isInView, setIsInView] = useState(false);
  const { once = true, ...observerOptions } = options;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      observerOptions
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, observerOptions, once]);

  return isInView;
}
