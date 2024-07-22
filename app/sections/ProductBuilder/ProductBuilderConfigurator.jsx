import React from 'react';
import {useProductBuilderContext} from './ProductBuilderContext';
import {ProductBuilderStep} from './ProductBuilderStep';
import {ProductBuilderSummary} from './ProductBuilderSummary';
import {ProductBuilderNavigation} from './ProductBuilderNavigation';
import {HighlightedMarkdown} from './HighlightedMarkdown';

export function ProductBuilderConfigurator() {
  const {productBuilderSettings, productBuilderData} =
    useProductBuilderContext();

  return (
    <div className="product-builder__form flex h-full flex-col px-5 pb-5 lg:py-5">
      {productBuilderData.page == 1 && (
        <div className="product-builder__header mb-8">
          {productBuilderSettings?.section?.header && (
            <h2 className="mb-5">
              <HighlightedMarkdown
                highlightColor={productBuilderSettings.section.highlightColor}
              >
                {productBuilderSettings.section.header}
              </HighlightedMarkdown>
            </h2>
          )}
          {productBuilderSettings?.section?.description && (
            <HighlightedMarkdown
              highlightColor={productBuilderSettings.section.highlightColor}
            >
              {productBuilderSettings.section.description}
            </HighlightedMarkdown>
          )}
        </div>
      )}
      {productBuilderData.page == 'summary' ? (
        <ProductBuilderSummary />
      ) : (
        <ProductBuilderStep />
      )}
      <ProductBuilderNavigation />
    </div>
  );
}
