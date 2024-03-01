import {DEFAULT_LOCALE} from '~/lib/constants';
import {useRootLoaderData} from '~/hooks';

/**
 * Get selected locale of buyer
 * @returns Locale
 */

export function useLocale() {
  const rootData = useRootLoaderData();
  return rootData?.selectedLocale ?? DEFAULT_LOCALE;
}
