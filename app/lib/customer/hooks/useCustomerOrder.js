import {useEffect} from 'react';
import {useLoaderData} from '@remix-run/react';

export function useCustomerOrder() {
  const {order, errors} = useLoaderData();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    if (errors?.length) {
      errors.forEach((error) => {
        console.error('customerOrder:error', error);
      });
    }
  }, [errors]);

  return {order};
}
