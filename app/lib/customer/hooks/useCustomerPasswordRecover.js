import {useCallback} from 'react';
import {useFetcher} from '@remix-run/react';

import {useLocale} from '~/hooks';

import {useFetcherStatus} from './useFetcherStatus';

export function useCustomerPasswordRecover() {
  const fetcher = useFetcher({key: 'recover-password'});
  const locale = useLocale();

  const {status} = useFetcherStatus({state: fetcher.state});

  const recoverPassword = useCallback(
    (e) => {
      e.preventDefault();
      if (status.started) return;
      const formData = new FormData(e.currentTarget);
      formData.append('action', 'recover-password');
      fetcher.submit(formData, {
        method: 'POST',
        action: `${locale.pathPrefix}/account/login`,
      });
    },
    [status.started],
  );

  return {
    recoverPasswordEmailSent: fetcher.data?.recoverPasswordEmailSent || false,
    recoverPassword,
    status,
  };
}
