import {useState, useEffect} from 'react';

/**
 * Hook that returns whether the app has been hydrated (mounted)
 * @returns {boolean} whether the app has been hydrated
 */

export function useIsHydrated() {
  const [isHydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return isHydrated;
}
