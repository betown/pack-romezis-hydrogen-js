import {useLocale} from './useLocale';

/**
 * Adds the locale prefix to the given path
 * @param path
 * @returns Path with locale prefix
 */

export function usePrefixPathWithLocale(path) {
  const {pathPrefix} = useLocale();

  return `${pathPrefix}${path.startsWith('/') ? path : '/' + path}`;
}
