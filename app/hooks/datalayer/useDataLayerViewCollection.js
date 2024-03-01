import {useEffect} from 'react';

import {useGlobal} from '~/hooks';

export function useDataLayerViewCollection({collection}) {
  const {emitter} = useGlobal();

  useEffect(() => {
    if (!emitter?._events['VIEW_COLLECTION_PAGE']) return;
    if (!collection?.products?.nodes?.length) return;
    emitter?.emit(
      'VIEW_COLLECTION_PAGE',
      collection.products.nodes.slice(0, 12),
    );
  }, [emitter?._eventsCount, collection?.id]);
}
