import {useVariantPrices} from '~/hooks';

export function ProductItemPrice({selectedVariant}) {
  const {price, compareAtPrice} = useVariantPrices(selectedVariant);

  return (
    <div className="mt-1 flex flex-1 flex-wrap gap-x-1">
      {compareAtPrice && (
        <p className="text-sm text-mediumDarkGray line-through">
          {compareAtPrice}
        </p>
      )}
      <p className="min-h-[1.25rem] text-sm">{price}</p>
    </div>
  );
}

ProductItemPrice.displayName = 'ProductItemPrice';
