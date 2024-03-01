import {json} from '@shopify/remix-oxygen';

import {PREDICTIVE_SEARCH_QUERY} from '~/data/queries';

const DEFAULT_SEARCH_TYPES = ['COLLECTION', 'QUERY'];

export async function action({request, params, context}) {
  if (request.method !== 'POST') {
    throw new Error('Invalid request method');
  }
  const search = await fetchPredictiveSearchResults({
    params,
    request,
    context,
  });
  return json(search);
}

async function fetchPredictiveSearchResults({params, request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  let body;
  try {
    body = await request.formData();
  } catch (error) {}
  const searchTerm = String(body?.get('q') || searchParams.get('q') || '');
  const limit = Number(body?.get('limit') || searchParams.get('limit') || 10);
  const rawTypes = String(
    body?.get('type') || searchParams.get('type') || 'ANY',
  );
  const searchTypes =
    rawTypes === 'ANY'
      ? DEFAULT_SEARCH_TYPES
      : rawTypes
          .split(',')
          .map((t) => t.toUpperCase())
          .filter((t) => DEFAULT_SEARCH_TYPES.includes(t));

  if (!searchTerm) {
    return {
      searchResults: {results: null, totalResults: 0},
      searchTerm,
      searchTypes,
    };
  }

  const data = await storefront.query(PREDICTIVE_SEARCH_QUERY, {
    variables: {
      limit,
      limitScope: 'EACH',
      searchTerm,
      types: searchTypes,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    cache: storefront.CacheShort(),
  });

  if (!data) {
    throw new Error('No data returned from Shopify API');
  }

  const searchResults = normalizePredictiveSearchResults(
    data.predictiveSearch,
    params.locale,
  );

  return {searchResults, searchTerm, searchTypes};
}

/**
 * Normalize results and apply tracking qurery parameters to each result url
 */
export function normalizePredictiveSearchResults(predictiveSearch, locale) {
  let totalResults = 0;
  if (!predictiveSearch) {
    return {
      results: null,
      totalResults,
    };
  }

  const localePrefix = locale ? `/${locale}` : '';
  const results = [];

  if (predictiveSearch.queries.length) {
    results.push({
      type: 'queries',
      items: predictiveSearch.queries.map((query) => {
        totalResults++;
        return {
          __typename: query.__typename,
          handle: '',
          id: query.text,
          image: undefined,
          title: query.text,
          styledTitle: query.styledText,
          url: `${localePrefix}/search`,
        };
      }),
    });
  }

  if (predictiveSearch.collections.length) {
    results.push({
      type: 'collections',
      items: predictiveSearch.collections.map((collection) => {
        totalResults++;
        return {
          __typename: collection.__typename,
          handle: collection.handle,
          id: collection.id,
          image: collection.image,
          title: collection.title,
          url: `${localePrefix}/collections/${collection.handle}`,
        };
      }),
    });
  }

  return {results, totalResults};
}
