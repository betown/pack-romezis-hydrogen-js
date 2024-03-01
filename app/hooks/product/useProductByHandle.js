import {useEffect} from 'react';
import {useFetcher} from '@remix-run/react';

import {useLocale} from '~/hooks';

/**
 * Fetch product item by its handle
 * @param handle - The handle of the product
 * @returns product item
 * @example
 * ```js
 * const product = useProductByHandle('product-handle');
 * ```
 */

export function useProductByHandle(handle = '') {
  const {pathPrefix} = useLocale();
  const fetcher = useFetcher({
    key: `product-by-handle:${handle}:${pathPrefix}`,
  });

  useEffect(() => {
    if (!handle || fetcher.data?.product) return;
    fetcher.submit(
      {handle},
      {method: 'POST', action: `${pathPrefix}/api/product`},
    );
  }, [handle]);

  return fetcher.data?.product || null;
}
