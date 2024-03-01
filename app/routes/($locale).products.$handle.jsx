import {useLoaderData} from '@remix-run/react';
import {ProductProvider} from '@shopify/hydrogen-react';
import {json} from '@shopify/remix-oxygen';
import {AnalyticsPageType} from '@shopify/hydrogen';
import {RenderSections} from '@pack/react';

import {
  formatGroupingWithOptions,
  getMetafields,
  getShop,
  getSiteSettings,
} from '~/lib/utils';
import {
  GROUPING_PRODUCT_QUERY,
  PRODUCT_GROUPINGS_QUERY,
  PRODUCT_PAGE_QUERY,
  PRODUCT_QUERY,
} from '~/data/queries';
import {Product} from '~/components';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';

/*
 * Add metafield queries to the METAFIELD_QUERIES array to fetch desired metafields for product pages
 * e.g. [{namespace: 'global', key: 'description'}, {namespace: 'product', key: 'seasonal_colors'}]
 */
const METAFIELD_QUERIES = [];

export const headers = routeHeaders;

export async function loader({params, context, request}) {
  const {handle} = params;
  const {storefront} = context;
  const pageData = await context.pack.query(PRODUCT_PAGE_QUERY, {
    variables: {handle},
    cache: context.storefront.CacheShort(),
  });

  if (!pageData.data?.productPage) throw new Response(null, {status: 404});

  const storeDomain = storefront.getShopifyDomain();
  const searchParams = new URL(request.url).searchParams;
  const selectedOptions = [];

  // set selected options from the query string
  searchParams.forEach((value, name) => {
    selectedOptions.push({name, value});
  });

  let {product: queriedProduct} = await storefront.query(PRODUCT_QUERY, {
    variables: {
      handle,
      selectedOptions,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    cache: storefront.CacheShort(),
  });

  if (!queriedProduct) throw new Response(null, {status: 404});

  if (METAFIELD_QUERIES?.length) {
    const metafields = await getMetafields(context, {
      handle,
      metafieldQueries: METAFIELD_QUERIES,
    });
    queriedProduct = {...queriedProduct, metafields};
  }

  const groupingsData = await context.pack.query(PRODUCT_GROUPINGS_QUERY, {
    variables: {first: 100},
    cache: context.storefront.CacheShort(),
  });

  let grouping = groupingsData.data.groups.edges.find(({node}) => {
    const groupingProducts = [
      ...node.products,
      ...node.subgroups.flatMap(({products}) => products),
    ];
    return groupingProducts.some(
      (groupProduct) => groupProduct.handle === handle,
    );
  })?.node;

  if (grouping) {
    const productsToQuery = [
      ...grouping.products,
      ...grouping.subgroups.flatMap(({products}) => products),
    ];
    const groupingProductsPromises = productsToQuery.map(async (product) => {
      if (product.handle === handle) return null;
      const data = await storefront.query(GROUPING_PRODUCT_QUERY, {
        variables: {
          handle: product.handle,
          country: storefront.i18n.country,
          language: storefront.i18n.language,
        },
        cache: storefront.CacheShort(),
      });
      return data.product;
    });

    let groupingProducts = await Promise.all(groupingProductsPromises);
    groupingProducts = groupingProducts.filter(Boolean);

    const groupingProductsByHandle = groupingProducts.reduce((acc, product) => {
      acc[product.handle] = product;
      return acc;
    }, {});
    groupingProductsByHandle[queriedProduct.handle] = queriedProduct;

    const groupingWithOptions = formatGroupingWithOptions({
      grouping,
      getProductByHandle: (handle) => groupingProductsByHandle[handle],
    });

    grouping = {
      ...groupingWithOptions,
      productsMap: groupingProductsByHandle,
    };
  }

  const product = {
    ...queriedProduct,
    ...(grouping?.products.length || grouping?.subgroups.length
      ? {grouping, isGrouped: true}
      : null),
  };

  const selectedVariant = product.selectedVariant ?? product.variants?.nodes[0];

  delete product.selectedVariant;

  const productAnalytics = {
    productGid: product.id,
    variantGid: selectedVariant.id,
    name: product.title,
    variantName: selectedVariant.title,
    brand: product.vendor,
    price: selectedVariant.price.amount,
  };
  const analytics = {
    pageType: AnalyticsPageType.product,
    resourceId: product.id,
    products: [productAnalytics],
    totalValue: parseFloat(selectedVariant.price.amount),
  };
  const shop = await getShop(context);
  const siteSettings = await getSiteSettings(context);
  const seo = seoPayload.product({
    product,
    selectedVariant,
    page: pageData.data.productPage,
    shop,
    siteSettings,
    url: request.url,
  });

  return json({
    analytics,
    product,
    productPage: pageData.data.productPage,
    selectedVariant,
    seo,
    storeDomain,
  });
}

export default function ProductRoute() {
  const {product, productPage, selectedVariant} = useLoaderData();

  return (
    <ProductProvider
      data={product}
      initialVariantId={selectedVariant?.id || null}
    >
      <div data-comp={ProductRoute.displayName}>
        <Product product={product} />

        <RenderSections content={productPage} />
      </div>
    </ProductProvider>
  );
}

ProductRoute.displayName = 'ProductRoute';
