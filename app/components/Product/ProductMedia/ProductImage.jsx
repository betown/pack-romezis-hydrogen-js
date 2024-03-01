import {Image} from '~/components';
import {PRODUCT_IMAGE_ASPECT_RATIO} from '~/lib/constants';

export function ProductImage({alt, image, onLoad, priority}) {
  return (
    <Image
      data={{
        ...image,
        altText: alt || image?.altText,
      }}
      aspectRatio={
        image?.width && image?.height
          ? `${image.width}/${image.height}`
          : PRODUCT_IMAGE_ASPECT_RATIO
      }
      onLoad={onLoad}
      className="media-fill"
      loading={priority ? 'eager' : 'lazy'}
      sizes="(min-width: 1440px) 900px, (min-width: 768px) 50vw, 100vw"
    />
  );
}

ProductImage.displayName = 'ProductImage';
