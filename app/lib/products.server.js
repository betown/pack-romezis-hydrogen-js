import invariant from 'tiny-invariant';

const FIRST = 250;

export const queryProducts = async ({
  context,
  query,
  variables,
  count: passedCount = 10,
}) => {
  if (!context || !query) return {products: [], hasMoreProducts: false};
  const {storefront} = context;

  let count = Number(passedCount);
  if (!count) count = 10;
  const isAll = count === Infinity; // only advisable for small inventory stores

  const initialFirst = isAll ? FIRST : count > FIRST ? FIRST : count;

  const getProducts = async ({products, cursor, first}) => {
    const {products: queriedProducts} = await storefront.query(query, {
      variables: {
        ...variables,
        first,
        endCursor: cursor,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
      cache: storefront.CacheShort(),
    });
    const {endCursor, hasNextPage} = queriedProducts.pageInfo;
    const compiledProducts = [...(products || []), ...queriedProducts.nodes];
    if (hasNextPage && compiledProducts.length < count) {
      return getProducts({
        products: compiledProducts,
        cursor: endCursor,
        first: Math.min(first, count - compiledProducts.length),
      });
    }
    return {products: compiledProducts, hasMoreProducts: hasNextPage};
  };

  const {products, hasMoreProducts} = await getProducts({
    products: null,
    cursor: null,
    first: initialFirst,
  });

  invariant(products, 'No data returned from top search query');

  return {products, hasMoreProducts};
};
