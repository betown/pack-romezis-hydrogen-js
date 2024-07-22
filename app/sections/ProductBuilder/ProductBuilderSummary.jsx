import {Image} from '~/components';
import {useProductBuilderContext} from './ProductBuilderContext';
import {ProductItemPrice} from '~/components/ProductItem/ProductItemPrice';
import {useMoney} from '@shopify/hydrogen-react';
import Markdown from 'react-markdown';

export function ProductBuilderSummary() {
  const {productBuilderData, productBuilderSettings} =
    useProductBuilderContext();
  const summarySettings = productBuilderSettings.summary;
  const selectedProducts = productBuilderData.selectedProducts.filter(
    (product) => product !== undefined,
  );

  const buildSummaryOptions = () => {
    return selectedProducts.map((product, index) => {
      const pieceName =
        productBuilderSettings.bundlePieces[index]?.pieceName ||
        product.product.title;
      return (
        <div className="mb-8" key={product?.product.handle}>
          <div className="summary-option__title mb-2.5 block text-lg font-bold">
            {pieceName}:
          </div>

          <div className="summary-option__details flex">
            <div className="summary-option__image mr-5 h-auto w-20 overflow-hidden">
              <Image
                className="block aspect-square bg-offWhite object-contain"
                data={product.image}
                width="100%"
              />
            </div>
            <div className="summary-option__selection ">
              {product?.selectedOptions?.map((option) => {
                return (
                  <div className="block" key={option.name}>
                    {option.name}: {option.value}
                  </div>
                );
              })}
            </div>
            {summarySettings?.showPrice && (
              <div className="summary-option__price ml-auto">
                <ProductItemPrice
                  selectedVariant={product}
                  className="flex flex-col items-end gap-1 text-current"
                />
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  const totalAmount = selectedProducts.reduce((acc, product) => {
    return acc + parseFloat(product.price.amount);
  }, 0);

  const totalPrice = useMoney({
    amount: totalAmount,
    currencyCode: selectedProducts[0].price.currencyCode,
  });

  return (
    <div className="summary">
      <div className="summary-header-container mb-5">
        {summarySettings?.header && (
          <h2 className="summary__title mb-2">{summarySettings?.header}</h2>
        )}
        {summarySettings?.description && (
          <Markdown className="summary__description">
            {summarySettings?.description}
          </Markdown>
        )}
      </div>
      <div>{buildSummaryOptions()}</div>
      <div className="summary-footer mb-5">
        <div className="summary-footer__total flex w-full">
          <div className="summary-total-label font-bold">Total:</div>
          <div className="summary-total-value ml-auto">
            {totalPrice.currencyCode} {totalPrice.amount}
          </div>
        </div>
      </div>
    </div>
  );
}
