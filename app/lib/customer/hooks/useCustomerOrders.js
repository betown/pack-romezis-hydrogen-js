import {useEffect} from 'react';
import {useLoaderData} from '@remix-run/react';

export function useCustomerOrders() {
  const {orders, errors} = useLoaderData();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    if (errors?.length) {
      errors.forEach((error) => {
        console.error('customerOrders:error', error);
      });
    }
  }, [errors]);

  return {orders};
}
