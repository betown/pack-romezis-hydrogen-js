import {useEffect, useRef} from 'react';

export function ProductVideo({inView, media, onLoad}) {
  const videoRef = useRef(null);

  const {sources, previewImage} = media;

  useEffect(() => {
    if (inView) {
      videoRef?.current?.play();
      if (typeof onLoad === 'function') onLoad();
    } else {
      videoRef?.current?.pause();
    }
  }, [inView]);

  return (
    <video
      ref={videoRef}
      muted
      playsInline
      loop
      controls={false}
      poster={previewImage?.url}
      className="media-fill"
    >
      {inView && sources?.length
        ? sources.map((source) => {
            if (!source?.url || !source?.mimeType) return null;
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
}

ProductVideo.displayName = 'ProductVideo';
