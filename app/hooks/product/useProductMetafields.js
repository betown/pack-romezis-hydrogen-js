import {useEffect} from 'react';
import {useFetcher} from '@remix-run/react';

import {useLocale} from '~/hooks';

export function useProductMetafields(handle = '', metafieldQueries = []) {
  const {pathPrefix} = useLocale();
  const metafieldQueriesString = JSON.stringify(metafieldQueries);
  const fetcher = useFetcher({
    key: `product-metafields:${handle}:${pathPrefix}:${metafieldQueriesString}`,
  });
  const {metafields} = {...fetcher.data};

  useEffect(() => {
    if (!handle || !metafieldQueries?.length) return;
    fetcher.submit(
      {handle, metafieldQueries: metafieldQueriesString},
      {method: 'POST', action: `${pathPrefix}/api/product`},
    );
  }, [handle, metafieldQueriesString]);

  return metafields || null;
}
