import {useMemo} from 'react';
import {useSiteSettings} from '@pack/react';

/**
 * Generate a table of color swatches from the site settings
 * @returns map of color swatches
 * @example
 * ```js
 * const swatchesMap = useColorSwatches();
 * ```
 */

export function useColorSwatches() {
  const siteSettings = useSiteSettings();
  const {swatches} = {
    ...siteSettings?.settings?.product?.colors,
  };

  return useMemo(() => {
    if (!swatches?.length) return {};
    return swatches.reduce((acc, {name, color, image}) => {
      return {
        ...acc,
        [name?.toLowerCase().trim()]: image?.src || color,
      };
    }, {});
  }, [swatches]);
}
