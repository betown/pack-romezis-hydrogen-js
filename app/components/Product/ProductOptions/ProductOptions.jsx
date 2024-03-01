import {useProduct} from '@shopify/hydrogen-react';

import {COLOR_OPTION_NAME} from '~/lib/constants';

import {ProductColorOptionValues} from './ProductColorOptionValues';
import {ProductOptionValues} from './ProductOptionValues';

export function ProductOptions({product}) {
  const _product = useProduct();
  const {setSelectedOption} = _product;
  const selectedOptionsMap = _product.selectedOptions;

  return (
    <div className="flex flex-col">
      {product.options?.map(({name, values}, index) => {
        return (
          <div
            key={index}
            className="border-b border-b-border py-4 first:border-t first:border-t-border"
          >
            {name === COLOR_OPTION_NAME ? (
              <ProductColorOptionValues
                product={product}
                name={name}
                selectedOptionsMap={selectedOptionsMap}
                setSelectedOption={setSelectedOption}
              />
            ) : (
              <ProductOptionValues
                product={product}
                name={name}
                selectedOptionsMap={selectedOptionsMap}
                setSelectedOption={setSelectedOption}
                values={values}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

ProductOptions.displayName = 'ProductOptions';
