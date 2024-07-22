import {useColorSwatches, useMatchMedia, useProductByHandle} from '~/hooks';
import {useProductBuilderContext} from './ProductBuilderContext';
import {useEffect, useRef, useState} from 'react';
import {HighlightedMarkdown} from './HighlightedMarkdown';

export function ProductBuilderStep() {
  const firstOption = useRef(null);
  const step = useRef(null);
  const {productBuilderSettings, productBuilderData, updateProductBuilderData} =
    useProductBuilderContext();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const stepSettings =
    productBuilderSettings?.bundlePieces?.[productBuilderData.page - 1];
  const product = useProductByHandle(stepSettings?.product?.handle);
  const optionStyles = productBuilderSettings?.section?.optionStyle;
  const swatchesMap = useColorSwatches();
  const highlightColor =
    stepSettings.highlightColor ||
    productBuilderSettings?.section?.highlightColor;
  const isMobile = useMatchMedia('(max-width: 767px)');

  const buildProductOptions = (product) => {
    const productOptions = product?.options?.map((option, index) => {
      const currentOptionStyle =
        optionStyles?.find(
          (style) =>
            style.optionName.toLowerCase() === option.name.toLowerCase(),
        )?.selectorStyle || 'buttons';

      return (
        <div key={`$option-${option.name}`} className="product-builder__option">
          <div className="product-builder__option-header flex items-baseline">
            <h2 className="mb-0 text-lg">
              {option.name}
              {productBuilderSettings.section.showSelectedOption &&
                typeof selectedOptions[index] !== 'undefined' &&
                ':'}
            </h2>
            {productBuilderSettings.section.showSelectedOption &&
              typeof selectedOptions[index] !== 'undefined' && (
                <span className="product-builder__option-value ml-1">
                  {selectedOptions[index]}
                </span>
              )}
          </div>
          <div
            className={`flex justify-start gap-5 py-5 ${
              currentOptionStyle == 'buttons' && 'flex-col'
            }`}
          >
            {option.values.map((value, valueIndex) => {
              return (
                <label
                  key={`${option.name}-${value.replace(/\s/g, '-')}`}
                  className={`relative w-full cursor-pointer ${
                    currentOptionStyle == 'swatches' && 'w-1/4 max-w-[25%]'
                  }`}
                >
                  <input
                    type="radio"
                    name={option.name}
                    className="peer absolute h-full w-full cursor-pointer appearance-none"
                    checked={selectedOptions[index] === value}
                    ref={index === 0 && valueIndex === 0 ? firstOption : null}
                    onChange={() => {
                      const newOptions = [...selectedOptions];
                      newOptions[index] = value;
                      setSelectedOptions(newOptions);
                    }}
                  />
                  {currentOptionStyle == 'buttons' && (
                    <div
                      className={'rounded-lg border px-3 py-2'}
                      style={{
                        borderColor:
                          selectedOptions[index] === value
                            ? highlightColor || '#000'
                            : '#c0c0c0',
                      }}
                    >
                      {value}
                    </div>
                  )}
                  {currentOptionStyle == 'swatches' && (
                    <div className="swatch-container flex flex-col items-center justify-center text-center">
                      <div
                        className="mb-2 h-10 w-10 rounded-full border p-1"
                        style={{
                          borderColor:
                            selectedOptions[index] === value
                              ? highlightColor || '#000'
                              : '#c0c0c0',
                        }}
                      >
                        <span
                          className="block h-full w-full rounded-full border border-gray"
                          style={{
                            backgroundColor: swatchesMap[value.toLowerCase()],
                          }}
                        ></span>
                      </div>
                      <span
                        className="swatch-value block w-full overflow-hidden text-ellipsis whitespace-nowrap"
                        title={value}
                      >
                        {value}
                      </span>
                    </div>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      );
    });

    return productOptions;
  };

  useEffect(() => {
    if (product && selectedOptions.length == product?.options?.length) {
      const selectedVariant = product?.variants?.nodes.find((variant) => {
        return variant.selectedOptions.every((option) => {
          return selectedOptions.includes(option.value);
        });
      });

      const newSelectedProducts = productBuilderData.selectedProducts;
      newSelectedProducts[productBuilderData.page - 1] = selectedVariant;

      updateProductBuilderData({selectedProducts: newSelectedProducts});
    }
  }, [selectedOptions]);

  useEffect(() => {
    if (productBuilderData.page > 1 || productBuilderData.page == 'summary') {
      firstOption.current?.focus();
      if (isMobile) {
        step.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }

    if (productBuilderData?.selectedProducts?.[productBuilderData.page - 1]) {
      setSelectedOptions(
        productBuilderData.selectedProducts[
          productBuilderData.page - 1
        ].selectedOptions.map((option) => option.value),
      );
    }

    return () => {
      setSelectedOptions([]);
    };
  }, [productBuilderData.page]);

  return (
    <div
      className="product-builder__step mb-5"
      ref={step}
      style={{
        scrollMarginTop: 'var(--header-height)',
      }}
    >
      {stepSettings?.header && (
        <h3 className="product-builder__step-header mb-2">
          <HighlightedMarkdown highlightColor={highlightColor}>
            {stepSettings.header.replace('{productName}', product?.title)}
          </HighlightedMarkdown>
        </h3>
      )}
      {stepSettings?.description && (
        <p className="product-builder__step-description mb-5">
          <HighlightedMarkdown highlightColor={highlightColor}>
            {stepSettings.description}
          </HighlightedMarkdown>
        </p>
      )}
      <div className='="product-builder__options'>
        {buildProductOptions(product)}
      </div>
    </div>
  );
}
