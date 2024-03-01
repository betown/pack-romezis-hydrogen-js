import {json} from '@shopify/remix-oxygen';
import {AnalyticsPageType} from '@shopify/hydrogen';

import {CartPage} from '~/components';
import {getShop, getSiteSettings} from '~/lib/utils';
import {seoPayload} from '~/lib/seo.server';

export async function loader({context}) {
  const shop = await getShop(context);
  const siteSettings = await getSiteSettings(context);
  const analytics = {pageType: AnalyticsPageType.cart};
  const seo = seoPayload.page({
    page: {
      title: 'Cart',
    },
    shop,
    siteSettings,
  });
  return json({analytics, seo});
}

export default function CartRoute() {
  return <CartPage />;
}

CartRoute.displayName = 'CartRoute';
