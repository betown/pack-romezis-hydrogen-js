import {useCallback, useEffect} from 'react';
import {useFetcher} from '@remix-run/react';

import {useFetcherStatus} from './useFetcherStatus';

export function useCustomerUpdateProfile() {
  const fetcher = useFetcher({key: 'update-profile'});

  const {customer, errors: apiErrors, formErrors} = {...fetcher.data};

  const {errors, setErrors, status} = useFetcherStatus({
    fetcherErrors: formErrors,
    state: fetcher.state,
  });

  const updateCustomerDetails = useCallback(
    (e) => {
      e.preventDefault();
      if (status.started) return;
      setErrors([]);
      const formData = new FormData(e.currentTarget);
      formData.append('action', 'update-profile');
      fetcher.submit(formData, {method: 'POST'});
    },
    [status.started],
  );

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    if (!apiErrors?.length) return;
    apiErrors.forEach((error) => {
      return console.error('customerUpdateProfile:error', error);
    });
  }, [apiErrors]);

  return {
    customer,
    updateCustomerDetails,
    errors,
    status,
  };
}
