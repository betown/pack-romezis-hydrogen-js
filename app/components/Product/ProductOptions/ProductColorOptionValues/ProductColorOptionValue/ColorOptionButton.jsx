import {useMemo} from 'react';

import {ColorOptionIcon} from './ColorOptionIcon';

export function ColorOptionButton({
  isSelected,
  name,
  product,
  setSelectedOption,
  swatch,
  value,
}) {
  const variantFromOptionValue = useMemo(() => {
    return product.variants.nodes.find(({selectedOptions}) => {
      return selectedOptions.find((option) => {
        return option.name === name && option.value === value;
      });
    });
  }, [name, product, value]);

  const disabled = !variantFromOptionValue;
  const optionValueIsAvailable = !!variantFromOptionValue?.availableForSale;

  return (
    <button
      aria-label={value}
      className="group/color"
      disabled={disabled}
      onClick={() => {
        if (isSelected) return;
        setSelectedOption(name, value);
      }}
      type="button"
    >
      <ColorOptionIcon
        disabled={disabled}
        isUnavailable={!optionValueIsAvailable && !disabled}
        isSelected={isSelected}
        swatch={swatch}
        value={value}
      />
    </button>
  );
}

ColorOptionButton.displayName = 'ColorOptionButton';
