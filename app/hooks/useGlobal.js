import {useGlobalContext} from '~/contexts';

/**
 * Hook for Global Provider, e.g. cartOpen, searchOpen, etc.
 * @returns Global context
 */

export function useGlobal() {
  const {state, actions} = useGlobalContext();
  return {
    ...state,
    ...actions,
  };
}
