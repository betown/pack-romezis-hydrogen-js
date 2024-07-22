import {useEffect, useRef, useState} from 'react';
import {useProductBuilderContext} from './ProductBuilderContext';
import {useProductByHandle} from '~/hooks';
import {Image} from '~/components';

export function ProductBuilderGallery() {
  const galleryContainer = useRef(null);
  const lastImage = useRef(null);
  const {productBuilderSettings, productBuilderData} =
    useProductBuilderContext();

  const [productImages, setProductImages] = useState([]);
  const currentPage = productBuilderData.page;
  const currentPageProduct = useProductByHandle(
    productBuilderSettings.bundlePieces?.[currentPage - 1]?.product?.handle,
  );
  const selectedProducts = productBuilderData.selectedProducts;
  const selectedProductsImages = selectedProducts.map((product) => {
    return product?.image;
  });

  const imagesReferences = JSON.stringify(selectedProductsImages);

  useEffect(() => {
    const hasProductImages = selectedProductsImages.length > 0;
    const currentStepHasProduct = !!selectedProducts?.[currentPage - 1];

    if (
      (hasProductImages && currentStepHasProduct) ||
      currentPage == 'summary'
    ) {
      setProductImages(selectedProductsImages);

      return;
    }

    const currentProductImage = currentPageProduct?.media.nodes.find(
      (node) => node.mediaContentType === 'IMAGE',
    )?.previewImage;

    if (hasProductImages) {
      setProductImages([...selectedProductsImages, currentProductImage]);

      return;
    }

    setProductImages([currentProductImage]);
  }, [currentPage, currentPageProduct, imagesReferences]);

  useEffect(() => {
    const galleryImages = Array.from(galleryContainer?.current?.children);
    const lastImage = galleryImages.pop();

    const imageLoaded =
      lastImage?.className?.indexOf('loading-placeholder') == -1;

    if (lastImage && imageLoaded) {
      lastImage.classList.add('translate-y-0', 'opacity-100');
    }
  }, [lastImage.current]);

  return (
    <div className="sticky top-0 aspect-video" ref={galleryContainer}>
      {productImages.map((image, index) => {
        return (
          <div
            key={`image-${image?.id}`}
            ref={currentPage == index + 1 ? lastImage : null}
            className={`absolute h-full w-full transition-all duration-300 ease-in-out ${
              currentPage == index + 1 &&
              selectedProductsImages.length < productImages.length
                ? '-translate-y-[10%] opacity-0'
                : 'opacity-100'
            }`}
            style={{
              opacity:
                index + 1 <= currentPage
                  ? null
                  : (currentPage / index + 1) * 0.1,
              translate:
                index + 1 <= currentPage
                  ? 0
                  : `0 ${-10 * (index + 1 - currentPage)}%`,
            }}
          >
            <Image
              data={{...image}}
              sizes="100vw, (min-width: 1023px) 58.33vw"
              className={`absolute left-0 top-0 h-full w-full bg-transparent object-cover`}
            />
          </div>
        );
      })}
    </div>
  );
}
