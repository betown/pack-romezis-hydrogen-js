import {useMemo} from 'react';
import {useMatches} from '@remix-run/react';

/**
 * Get the customer object
 * @returns customer
 * @example
 * ```js
 * const customer = useCustomer();
 * ```
 */

export function useCustomer() {
  const [root, account] = useMatches();
  const customerFromRoot = root?.data?.customer;
  const customerFromAccount = account?.data?.customer;

  return useMemo(() => {
    return customerFromAccount || customerFromRoot || null;
  }, [customerFromRoot, customerFromAccount]);
}
