import {useCallback, useEffect, useState} from 'react';
import {useFetcher} from '@remix-run/react';

import {useGroupingsContext} from '~/contexts';
import {formatGroupingWithOptions} from '~/lib/utils';
import {useLocale} from '~/hooks';

/**
 * Get product grouping object by handle from cache
 * @param handle handle of product
 * @returns product grouping object
 * @example
 * ```js
 * const grouping = useProductGroupingByHandle('product-handle');
 * ```
 */

export function useProductGroupingByHandle(handle = '') {
  const {pathPrefix} = useLocale();
  const fetcher = useFetcher({
    key: `product-grouping-by-handle:${handle}:${pathPrefix}`,
  });
  const {actions, state} = useGroupingsContext();
  const {setGroupings} = actions;
  const {groupings, groupingIndexesMap} = state;

  const groupingIndex = groupingIndexesMap?.[handle || ''] ?? -1;
  const cachedGrouping = groupings?.[groupingIndex]?.isReady
    ? groupings[groupingIndex]
    : null;

  const [grouping, setGrouping] = useState(cachedGrouping);

  const getProductGroupingByHandle = useCallback(
    (_handle = '') => {
      if (!groupings?.length) return null;
      const _groupingIndex = groupingIndexesMap?.[_handle] ?? -1;
      if (!(_groupingIndex >= 0)) return null;
      return groupings[_groupingIndex];
    },
    [groupings, groupingIndexesMap],
  );

  const groupingIsReady = !!grouping?.isReady;

  useEffect(() => {
    if (!groupings || !handle || groupingIsReady) return;
    setGrouping(getProductGroupingByHandle(handle));
  }, [groupings, handle]);

  useEffect(() => {
    if (!grouping?.allProducts || groupingIsReady) return;
    fetcher.submit(
      {handles: grouping.allProducts.map(({handle}) => handle)},
      {method: 'POST', action: `${pathPrefix}/api/products`},
    );
  }, [grouping?.id]);

  useEffect(() => {
    if (!grouping || !fetcher.data?.products) return;
    const productsMap = fetcher.data.products.reduce((acc, product) => {
      if (!product) return acc;
      return {...acc, [product.handle]: product};
    }, {});
    const groupingWithOptions = formatGroupingWithOptions({
      grouping,
      getProductByHandle: (handle) => productsMap[handle],
    });
    const readyGrouping = {
      ...groupingWithOptions,
      productsMap,
      isReady: true,
    };
    const updatedGroupings = groupings;
    updatedGroupings[groupingIndex] = readyGrouping;
    setGrouping(readyGrouping);
    setGroupings(updatedGroupings);
  }, [grouping?.id, fetcher.data?.products]);

  return grouping;
}
