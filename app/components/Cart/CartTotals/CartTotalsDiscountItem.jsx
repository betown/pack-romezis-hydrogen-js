import {useMoney} from '@shopify/hydrogen-react';

import {prefixNonUsdDollar} from '~/hooks/product/useVariantPrices';
import {Svg} from '~/components';

export function CartTotalsDiscountItem({discount}) {
  const formattedDiscount = useMoney({
    amount: discount.discountedAmount?.amount || '',
    currencyCode: discount.discountedAmount?.currencyCode,
  });
  const discountAmount = prefixNonUsdDollar(formattedDiscount);

  const code = discount.code;
  const title = discount.title;

  return formattedDiscount ? (
    <div className="flex justify-between text-sm text-mediumDarkGray">
      <div className="flex items-center gap-1">
        {code && (
          <Svg
            className="w-4"
            src="/svgs/discount.svg#discount"
            title="Close"
            viewBox="0 0 24 24"
          />
        )}

        <p>{code || title || ''}</p>
      </div>

      <p>-{discountAmount}</p>
    </div>
  ) : null;
}

CartTotalsDiscountItem.displayName = 'CartTotalsDiscountItem';
