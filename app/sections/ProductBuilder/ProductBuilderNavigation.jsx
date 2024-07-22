import {useEffect, useState} from 'react';
import {useProductBuilderContext} from './ProductBuilderContext';
import {useCart} from '@shopify/hydrogen-react';
import {useGlobal} from '~/hooks';

export function ProductBuilderNavigation() {
  const {status, linesAdd, error} = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const {openCart} = useGlobal();

  const {productBuilderData, productBuilderSettings, updateProductBuilderData} =
    useProductBuilderContext();

  const stepData =
    productBuilderData.page !== 'summary'
      ? productBuilderSettings.bundlePieces?.[productBuilderData.page - 1]
      : null;
  const selectedProduct =
    productBuilderData.selectedProducts?.[productBuilderData.page - 1] || null;

  const submitProductBuilderData = () => {
    setIsAdding(true);
    linesAdd(
      productBuilderData.selectedProducts.map((product) => {
        return {
          quantity: 1,
          merchandiseId: product.id,
          attributes: [
            {
              key: '_type',
              value: 'builtProduct',
            },
            {
              key: '_buildDate',
              value: String(Date.now()),
            },
          ],
        };
      }),
    );
  };

  useEffect(() => {
    if (isAdding && status == 'idle') {
      setIsAdding(false);
      openCart();
    }
  }, [isAdding, status]);

  useEffect(() => {
    if (error) {
      console.error('[ProductBuilder] Error adding product to cart', error);
    }
  }, [error]);

  return (
    <div className="product-builder__navigation-footer mt-auto flex w-full justify-between">
      {productBuilderData.page == 'summary' ? (
        <>
          <button
            className="btn-text text-sm"
            onClick={() => {
              updateProductBuilderData({
                page: productBuilderSettings.bundlePieces.length,
              });
            }}
          >
            &larr; Edit Product
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              submitProductBuilderData();
            }}
          >
            {productBuilderSettings?.summary?.AtcLabel
              ? productBuilderSettings.summary?.AtcLabel
              : 'Add to cart'}
          </button>
        </>
      ) : (
        <>
          {productBuilderData.page > 1 && (
            <button
              className="btn-text text-sm"
              onClick={() => {
                updateProductBuilderData({
                  page: productBuilderData.page - 1,
                });
              }}
            >
              &larr; Back
            </button>
          )}
          <button
            className="btn btn-primary ml-auto"
            onClick={() => {
              productBuilderData.page <
              productBuilderSettings.bundlePieces.length
                ? updateProductBuilderData({
                    page: productBuilderData.page + 1,
                  })
                : updateProductBuilderData({
                    page: 'summary',
                  });
            }}
            disabled={!stepData?.required && !selectedProduct}
          >
            {productBuilderData.page <
            productBuilderSettings?.bundlePieces?.length
              ? 'Continue'
              : 'Review the product'}
          </button>
        </>
      )}
    </div>
  );
}
