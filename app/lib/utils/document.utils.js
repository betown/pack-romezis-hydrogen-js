export const isLightHexColor = (hex) => {
  if (!hex || typeof hex !== 'string') return undefined;
  const hexArr = hex.toLowerCase().split('#').pop()?.split('');
  if (!hexArr) return undefined;
  const chars =
    hexArr.length === 3
      ? [hexArr[0], hexArr[2]]
      : [hexArr[0], hexArr[2], hexArr[4]];
  return chars.every((char) => ['f', 'e', 'd'].includes(char));
};

export const getAspectRatioFromClass = (className) => {
  if (!className) return undefined;
  const aspectRatio = className.match(/\[(.*?)\]/);
  if (!aspectRatio) return undefined;
  return aspectRatio[1];
};

export const getAspectRatioFromPercentage = (percentage) => {
  if (!percentage) return undefined;
  const match = percentage.match(/\d+/);
  if (!match) return undefined;
  const number = parseInt(match[0], 10);
  return `1/${number / 100}`;
};
