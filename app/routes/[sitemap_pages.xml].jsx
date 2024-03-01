import {CMS_PAGES_QUERY} from '~/data/queries';
import {generatedSitemapFromPages} from '~/lib/utils';

export async function loader({context}) {
  const SITE_DOMAIN = context.storefront.getShopifyDomain();

  const getPages = async ({first, pages, cursor}) => {
    const {data} = await context.pack.query(CMS_PAGES_QUERY, {
      variables: {first, cursor},
      cache: context.storefront.CacheShort(),
    });
    const {endCursor, hasNextPage} = data.pages.pageInfo;
    const compiledPages = [...(pages || []), ...data.pages.nodes];
    if (hasNextPage && compiledPages.length < 10000) {
      return getPages({
        first: Math.min(10000 - compiledPages.length, 100),
        pages: compiledPages,
        cursor: endCursor,
      });
    }
    return compiledPages;
  };
  const pages = await getPages({
    first: 250,
    pages: null,
    cursor: null,
  });
  const sitemap = generatedSitemapFromPages({
    pages,
    siteUrl: SITE_DOMAIN,
    route: 'pages',
  });

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      encoding: 'UTF-8',
    },
  });
}
