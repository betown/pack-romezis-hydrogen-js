export function Container({children, container}) {
  const {
    bgColor,
    bgColorCustom,
    tabletDesktopPaddingTop,
    tabletDesktopPaddingBottom,
    tabletDesktopMarginBottom,
    mobilePaddingTop,
    mobilePaddingBottom,
    mobileMarginBottom,
  } = {...container};
  const paddingClasses = `${tabletDesktopPaddingTop} ${tabletDesktopPaddingBottom} ${mobilePaddingTop} ${mobilePaddingBottom}`;
  const marginClasses = `${tabletDesktopMarginBottom} ${mobileMarginBottom}`;
  return (
    <div
      className={`${paddingClasses} ${marginClasses}`}
      style={{backgroundColor: bgColorCustom || bgColor}}
    >
      {children}
    </div>
  );
}

Container.displayName = 'SectionContainer';
