import {useMatches} from '@remix-run/react';

export function useRootLoaderData() {
  const [root] = useMatches();
  return {
    ...(root?.data || null),
  };
}
