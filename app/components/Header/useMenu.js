import {useCallback, useState} from 'react';

export function useMenu({settings}) {
  const {menuItems} = {...settings?.menu};

  const [menuIndex, setMenuIndex] = useState(null);

  const clearUnHoverTimer = useCallback(() => {
    if (window.unHover) {
      clearTimeout(window.unHover);
      window.unHover = null;
    }
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuIndex(null);
  }, []);

  const handleMenuStayOpen = useCallback(() => {
    clearUnHoverTimer();
    setMenuIndex(menuIndex);
  }, [menuIndex]);

  const handleMenuHoverIn = useCallback((index) => {
    clearUnHoverTimer();
    setMenuIndex(typeof index === 'number' ? index : null);
  }, []);

  const handleMenuHoverOut = useCallback(() => {
    clearUnHoverTimer();
    window.unHover = setTimeout(() => {
      setMenuIndex(null);
      clearUnHoverTimer();
    }, 100);
  }, []);

  return {
    handleMenuClose,
    handleMenuStayOpen,
    handleMenuHoverIn,
    handleMenuHoverOut,
    menuContent:
      typeof menuIndex === 'number' ? menuItems?.[menuIndex] || null : null,
    menuIndex,
  };
}
