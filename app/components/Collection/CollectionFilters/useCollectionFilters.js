import {useCollectionFiltersContext} from './CollectionFiltersProvider';

export function useCollectionFilters() {
  const {state, actions} = useCollectionFiltersContext();
  return {
    ...state,
    ...actions,
  };
}
