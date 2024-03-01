import {useMemo} from 'react';
import {useLocation} from '@remix-run/react';
import equal from 'fast-deep-equal';

import {Link} from '~/components';

import {ColorOptionIcon} from './ColorOptionIcon';

export function ColorOptionLink({
  groupingProductsMapByColor,
  isSelected,
  newSelectedOptions,
  swatch,
  value,
}) {
  const {search} = useLocation();
  const selectedVariantFromOptions = useMemo(() => {
    if (!groupingProductsMapByColor || !newSelectedOptions) return null;

    return groupingProductsMapByColor[value]?.variants.nodes.find(
      ({selectedOptions}) => {
        const selectedOptionsMap = selectedOptions.reduce(
          (acc, {name: optionName, value: optionValue}) => {
            return {
              ...acc,
              [optionName]: optionValue,
            };
          },
          {},
        );
        return equal(newSelectedOptions, selectedOptionsMap);
      },
    );
  }, [groupingProductsMapByColor, newSelectedOptions, value]);

  const url = useMemo(() => {
    if (!selectedVariantFromOptions) return null;

    const params = new URLSearchParams(search);
    selectedVariantFromOptions.selectedOptions.forEach(
      ({name: optionName, value: optionValue}) => {
        params.set(optionName, optionValue);
      },
    );

    return `/products/${selectedVariantFromOptions.product.handle}?${params}`;
  }, [search, selectedVariantFromOptions]);

  const disabled = !selectedVariantFromOptions;
  const optionValueIsAvailable = !!selectedVariantFromOptions?.availableForSale;

  return (
    <Link
      aria-label={value}
      className="group/color"
      preventScrollReset
      to={url}
    >
      <ColorOptionIcon
        disabled={disabled}
        isUnavailable={!optionValueIsAvailable && !disabled}
        isSelected={isSelected}
        swatch={swatch}
        value={value}
      />
    </Link>
  );
}

ColorOptionLink.displayName = 'ColorOptionLink';
