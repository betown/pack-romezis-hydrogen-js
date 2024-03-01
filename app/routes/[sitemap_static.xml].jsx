import {generatedSitemapFromPages, getSiteSettings} from '~/lib/utils';

const STATIC_PAGES = (accountNoIndex) => [
  {handle: '/', seo: {noIndex: false}},
  {handle: 'account', seo: {noIndex: accountNoIndex}},
  {handle: 'account/login', seo: {noIndex: accountNoIndex}},
  {handle: 'account/register', seo: {noIndex: accountNoIndex}},
  {handle: 'cart', seo: {noIndex: false}},
  {handle: 'search', seo: {noIndex: false}},
];

export async function loader({context}) {
  const SITE_DOMAIN = context.storefront.getShopifyDomain();
  const siteSettings = await getSiteSettings(context);
  const accountNoIndex =
    !!siteSettings?.data?.siteSettings?.settings?.account?.noIndex;

  const sitemap = generatedSitemapFromPages({
    pages: STATIC_PAGES(accountNoIndex),
    siteUrl: SITE_DOMAIN,
    route: 'static',
  });

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      encoding: 'UTF-8',
    },
  });
}
