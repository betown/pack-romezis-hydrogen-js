import {ProductOptionValuesLabel} from '../ProductOptionValuesLabel';

import {ProductOptionValue} from './ProductOptionValue';

export function ProductOptionValues({
  name,
  product,
  selectedOptionsMap,
  setSelectedOption,
  values,
}) {
  const productOrGroupingValues = product.isGrouped
    ? product.grouping?.optionsMap?.[name]
    : values;

  return (
    <div>
      <ProductOptionValuesLabel
        name={name}
        selectedValue={selectedOptionsMap?.[name]}
      />

      <ul className="flex flex-wrap gap-2">
        {productOrGroupingValues?.map((value) => {
          const isSelected = selectedOptionsMap?.[name] === value;

          return (
            <li key={value}>
              <ProductOptionValue
                isSelected={isSelected}
                name={name}
                product={product}
                selectedOptionsMap={selectedOptionsMap}
                setSelectedOption={setSelectedOption}
                value={value}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

ProductOptionValues.displayName = 'ProductOptionValues';
