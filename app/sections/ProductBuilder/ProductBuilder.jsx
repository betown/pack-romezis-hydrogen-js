import {useEffect, useRef, useState} from 'react';
import {Schema} from './ProductBuilder.schema';
import {ProductBuilderProvider} from './ProductBuilderContext';
import {Container} from '~/components';
import {ProductBuilderGallery} from './ProductBuilderGallery';
import {ProductBuilderConfigurator} from './ProductBuilderConfigurator';
import {ProductBuilderPagination} from './ProductBuilderPagination';

export function ProductBuilder({cms}) {
  const gallery = useRef(null);

  const productBuilderSettings = {
    section: cms.section,
    bundlePieces: cms.bundlePiece,
    summary: cms.summary,
  };

  const [productBuilderData, setProductBuilderData] = useState({
    page: 1,
    selectedProducts: [],
  });

  const updateProductBuilderData = (data) => {
    setProductBuilderData((prevData) => {
      return {
        ...prevData,
        ...data,
      };
    });
  };

  useEffect(() => {
    updateProductBuilderData({
      page: 1,
      selectedProducts: [],
    });
  }, [cms.bundlePiece]);

  return (
    <ProductBuilderProvider
      providerValues={{
        productBuilderSettings,
        productBuilderData,
        updateProductBuilderData,
      }}
    >
      <Container container={cms.container}>
        <div
          className={`relative mx-auto flex max-w-[1440px] flex-col gap-y-2 lg:flex-row ${
            productBuilderSettings?.section?.lightText == true && 'text-white'
          }`}
        >
          <ProductBuilderPagination />
          <div className="product-builder__gallery-container order-1 lg:w-7/12">
            <ProductBuilderGallery ref={gallery} />
          </div>
          <div className="product-builder__options order-3 lg:w-5/12">
            <ProductBuilderConfigurator />
          </div>
        </div>
      </Container>
    </ProductBuilderProvider>
  );
}

ProductBuilder.displayName = 'ProductBuilder';
ProductBuilder.Schema = Schema;
