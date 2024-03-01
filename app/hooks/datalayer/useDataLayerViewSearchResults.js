import {useEffect} from 'react';

import {useGlobal} from '~/hooks';

export function useDataLayerViewSearchResults({
  isSearchPage,
  products,
  searchTerm,
}) {
  const {emitter} = useGlobal();

  const SEARCH_EVENT = isSearchPage
    ? 'VIEW_SEARCH_PAGE_RESULTS'
    : 'VIEW_SEARCH_RESULTS';

  useEffect(() => {
    if (!emitter?._events[SEARCH_EVENT]) return;
    if (!products?.length) return;
    const results = products.slice(0, 12).map((product) => {
      return {...product, searchTerm};
    });
    emitter?.emit(SEARCH_EVENT, results);
  }, [emitter?._eventsCount, products]);
}
