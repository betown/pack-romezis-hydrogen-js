import {useCallback, useState} from 'react';

import {useBodyScrollLock} from '~/hooks';

export function useMenuDrawer({settings}) {
  const {lockBodyScroll, unlockBodyScroll} = useBodyScrollLock();
  const {menuItems} = {...settings?.menu};

  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [nestedDrawerIndex, setNestedDrawerIndex] = useState(null);

  const handleOpenDrawer = useCallback(() => {
    setMenuDrawerOpen(true);
    lockBodyScroll();
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setMenuDrawerOpen(false);
    setNestedDrawerIndex(null);
    unlockBodyScroll();
  }, []);

  const handleNestedDrawer = useCallback((index) => {
    setNestedDrawerIndex(typeof index === 'number' ? index : null);
  }, []);

  return {
    handleOpenDrawer,
    handleCloseDrawer,
    handleNestedDrawer,
    menuDrawerOpen,
    nestedDrawerContent:
      typeof nestedDrawerIndex === 'number'
        ? menuItems?.[nestedDrawerIndex] || null
        : null,
  };
}
