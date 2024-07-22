import {useVariantPrices} from '~/hooks';

export function ProductItemPrice({selectedVariant, className}) {
  const {price, compareAtPrice} = useVariantPrices(selectedVariant);

  return (
    <div className={`mt-1 flex flex-1 flex-wrap gap-x-1 ${className}`}>
      {compareAtPrice && (
        <p className="text-sm text-current line-through opacity-50">
          {compareAtPrice}
        </p>
      )}
      <p className="min-h-[1.25rem] text-sm">{price}</p>
    </div>
  );
}

ProductItemPrice.displayName = 'ProductItemPrice';
