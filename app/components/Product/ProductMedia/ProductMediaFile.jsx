import {MediaFile} from '@shopify/hydrogen';
import {useInView} from 'react-intersection-observer';

import {ProductImage} from './ProductImage';
import {ProductVideo} from './ProductVideo';

const TYPE_NAME_MAP = {
  MODEL_3D: 'Model3d',
  VIDEO: 'Video',
  IMAGE: 'MediaImage',
  EXTERNAL_VIDEO: 'ExternalVideo',
};

export function ProductMediaFile({alt, media, onLoad, priority}) {
  const {mediaContentType} = media;
  const {ref, inView} = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const image = {
    ...media.previewImage,
  };
  const {height, width} = image;
  const __typename = TYPE_NAME_MAP[mediaContentType];

  return (
    <div
      className="relative bg-offWhite"
      ref={ref}
      style={{
        aspectRatio:
          width && height
            ? width / height
            : 'var(--product-image-aspect-ratio)',
      }}
    >
      {(priority || inView) && (
        <>
          {mediaContentType === 'IMAGE' && (
            <ProductImage
              alt={alt}
              image={image}
              onLoad={onLoad}
              priority={priority}
            />
          )}

          {mediaContentType === 'EXTERNAL_VIDEO' && (
            <MediaFile
              data={{
                ...media,
                __typename,
              }}
              className="media-fill"
              onLoad={onLoad}
            />
          )}

          {mediaContentType === 'MODEL_3D' && (
            <MediaFile
              data={{
                ...media,
                __typename,
              }}
              className="media-fill"
              onLoad={onLoad}
            />
          )}
        </>
      )}

      {mediaContentType === 'VIDEO' && (
        <ProductVideo inView={inView} media={media} onLoad={onLoad} />
      )}
    </div>
  );
}

ProductMediaFile.displayName = 'ProductMediaFile';
