import {useMemo} from 'react';

import {COLOR_OPTION_NAME} from '~/lib/constants';

export function useProductMedia({product, selectedVariant}) {
  const colorOptions = useMemo(() => {
    return product.options?.find((option) => option.name === COLOR_OPTION_NAME)
      ?.values;
  }, [product.id]);

  const hasMultiColorsNotFromGroup =
    !product.isGrouped && colorOptions && colorOptions.length > 1;

  // if multi color variants from same product, create table pairing color w/ any media matching alt tag
  const mediaMapByAltText = useMemo(() => {
    if (!hasMultiColorsNotFromGroup) return null;

    const colorKeys = colorOptions.map((color) => color.toLowerCase());

    return colorOptions.reduce((acc, color) => {
      const medias = product.media.nodes;
      const colorKey = color.toLowerCase();
      const colorMedias = medias.filter((item) => {
        const alt = (
          item.alt ||
          item.image?.altText ||
          item.previewImage?.altText
        )
          ?.trim()
          .toLowerCase();
        return alt === colorKey && colorKeys.includes(alt);
      });
      return {...acc, [color]: colorMedias.length ? colorMedias : null};
    }, {});
  }, [product.id]);

  const mediaFromAltText = useMemo(() => {
    if (hasMultiColorsNotFromGroup && selectedVariant) {
      const color =
        selectedVariant?.selectedOptions?.find(
          (option) => option.name === COLOR_OPTION_NAME,
        )?.value || '';
      if (mediaMapByAltText?.[color]) {
        return mediaMapByAltText[color];
      }
    }
    return null;
  }, [hasMultiColorsNotFromGroup, mediaMapByAltText, selectedVariant?.id]);

  const media = useMemo(() => {
    return mediaFromAltText || product.media.nodes;
  }, [product.id, mediaFromAltText]);

  const initialIndex = useMemo(() => {
    if (!hasMultiColorsNotFromGroup || !selectedVariant || mediaFromAltText)
      return 0;
    const mediaIndex = product.media.nodes.findIndex(
      ({previewImage}) => previewImage?.url === selectedVariant?.image?.url,
    );
    return mediaIndex >= 0 ? mediaIndex : 0;
  }, [
    hasMultiColorsNotFromGroup,
    product.id,
    mediaFromAltText,
    selectedVariant?.id,
  ]);

  const maybeHasImagesByVariant =
    !!hasMultiColorsNotFromGroup && !mediaFromAltText;

  return {initialIndex, maybeHasImagesByVariant, media};
}
