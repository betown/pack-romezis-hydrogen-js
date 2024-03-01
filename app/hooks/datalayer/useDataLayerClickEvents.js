import {useCallback} from 'react';

import {pathWithoutLocalePrefix} from '~/lib/utils';
import {useGlobal} from '~/hooks';

export const useDataLayerClickEvents = () => {
  const {emitter} = useGlobal();

  const sendClickProductItemEvent = useCallback(
    ({
      isSearchResult,
      listIndex,
      product,
      searchTerm,
      selectedVariant: _selectedVariant,
    }) => {
      if (!_selectedVariant || typeof listIndex !== 'number') return;
      const windowPathname = pathWithoutLocalePrefix(window.location.pathname);

      const selectedVariant = {
        ..._selectedVariant,
        image: _selectedVariant.image || product?.featuredImage || '',
        index: listIndex,
        product: {
          ..._selectedVariant.product,
          vendor: product?.vendor,
        },
        list: windowPathname.startsWith('/collections') ? windowPathname : '',
        ...(searchTerm ? {searchTerm} : null),
      };

      emitter?.emit(
        isSearchResult ? 'CLICK_SEARCH_ITEM' : 'CLICK_COLLECTION_ITEM',
        selectedVariant,
      );
    },
    [emitter?._eventsCount],
  );

  const sendSubscribeEvent = useCallback(
    ({email, phone}) => {
      if (email) {
        emitter?.emit('SUBSCRIBE_EMAIL', email);
      }
      if (phone) {
        emitter?.emit('SUBSCRIBE_PHONE', phone);
      }
    },
    [emitter?._eventsCount],
  );

  const sendLogInEvent = useCallback(() => {
    emitter?.emit('CUSTOMER_LOGGED_IN');
  }, [emitter?._eventsCount]);

  const sendRegisterEvent = useCallback(() => {
    emitter?.emit('CUSTOMER_REGISTERED');
  }, [emitter?._eventsCount]);

  return {
    sendClickProductItemEvent,
    sendSubscribeEvent,
    sendLogInEvent,
    sendRegisterEvent,
  };
};
