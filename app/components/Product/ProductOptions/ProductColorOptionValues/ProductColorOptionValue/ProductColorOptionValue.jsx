import {useMemo} from 'react';
import {useSiteSettings} from '@pack/react';

import {ColorOptionButton} from './ColorOptionButton';
import {ColorOptionLink} from './ColorOptionLink';

export function ProductColorOptionValue({
  groupingProductsMapByColor,
  isSelected,
  name,
  product,
  selectedOptionsMap,
  setSelectedOption,
  value,
}) {
  const siteSettings = useSiteSettings();
  const swatches = siteSettings?.settings?.product?.colors?.swatches;
  const isFromGrouping = product.isGrouped;

  const newSelectedOptions = useMemo(() => {
    return selectedOptionsMap
      ? {
          ...selectedOptionsMap,
          [name]: value,
        }
      : null;
  }, [name, selectedOptionsMap, value]);

  const swatch = useMemo(() => {
    if (!swatches) return null;
    return (
      swatches.find(
        ({name: swatchName}) =>
          swatchName?.trim().toLowerCase() === value.toLowerCase(),
      ) || null
    );
  }, [swatches, value]);

  return isFromGrouping ? (
    <ColorOptionLink
      groupingProductsMapByColor={groupingProductsMapByColor}
      isSelected={isSelected}
      newSelectedOptions={newSelectedOptions}
      swatch={swatch}
      value={value}
    />
  ) : (
    <ColorOptionButton
      isSelected={isSelected}
      name={name}
      product={product}
      setSelectedOption={setSelectedOption}
      swatch={swatch}
      value={value}
    />
  );
}

ProductColorOptionValue.displayName = 'ProductColorOptionValue';
