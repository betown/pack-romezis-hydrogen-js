import {useMemo} from 'react';

import {Image} from '~/components';
import {isLightHexColor} from '~/lib/utils';

export function ColorOptionIcon({
  disabled,
  isUnavailable,
  isSelected,
  swatch,
  value,
}) {
  const isLightColor = useMemo(() => {
    return isLightHexColor(swatch?.color);
  }, [swatch?.color]);
  const validClass = !disabled
    ? 'md:group-hover/color:border-text'
    : 'cursor-not-allowed';
  const selectedClass = isSelected ? 'border-text' : '';
  const unavailableClass = isUnavailable
    ? `after:h-px after:w-[150%] after:rotate-[135deg] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 overflow-hidden ${
        isLightColor ? 'after:bg-black' : 'after:bg-white'
      }`
    : '';

  return (
    <div
      className={`relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-[50%] border border-border transition ${validClass} ${unavailableClass} ${selectedClass}`}
      style={{
        backgroundColor:
          isSelected && swatch?.color === '#FFFFFF'
            ? 'var(--off-white)'
            : swatch?.color,
      }}
    >
      {swatch?.image?.src && (
        <Image
          data={{
            altText: value,
            url: swatch.image.src,
            width: swatch.image.width,
            height: swatch.image.height,
          }}
          aspectRatio="1/1"
          width="32"
          className="media-fill"
          isStatic
        />
      )}

      <div
        className={`media-fill rounded-[50%] border-white transition-[border-width] duration-100 ${
          isSelected ? 'border-[3px]' : 'border-[0px]'
        }`}
      />
    </div>
  );
}

ColorOptionIcon.displayName = 'ColorOptionIcon';
