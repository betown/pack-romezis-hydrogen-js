import {registerStorefrontSettingsSchema} from '@pack/react';

import account from './account';
import analytics from './analytics';
import cart from './cart';
import collection from './collection';
import footer from './footer';
import header from './header';
import notFound from './not-found';
import localization from './localization';
import product from './product';
import search from './search';

export function registerStorefrontSettings() {
  registerStorefrontSettingsSchema([
    account,
    analytics,
    cart,
    collection,
    footer,
    header,
    localization,
    notFound,
    product,
    search,
  ]);
}
