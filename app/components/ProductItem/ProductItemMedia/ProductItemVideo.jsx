import {forwardRef} from 'react';

export const ProductItemVideo = forwardRef(({autoPlay = false, media}, ref) => {
  const {sources, previewImage} = media;
  const videoSources = sources?.filter(
    ({mimeType}) => mimeType === 'video/mp4',
  );

  return (
    <video
      ref={ref}
      autoPlay={autoPlay}
      muted
      playsInline
      loop
      controls={false}
      poster={previewImage?.url}
      className="absolute inset-0 h-full w-full"
    >
      {videoSources?.length
        ? videoSources.map((source) => {
            return (
              <source
                key={source.url}
                src={source.url}
                type={source.mimeType}
              />
            );
          })
        : null}
    </video>
  );
});

ProductItemVideo.displayName = 'ProductItemVideo';
