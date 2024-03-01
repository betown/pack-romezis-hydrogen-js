import {useState} from 'react';

const PROMOBAR_HEIGHT = 48;

export function usePromobar({settings}) {
  const [promobarHidden, setPromobarHidden] = useState(false);

  const promobar = settings?.promobar;
  const promobarDisabled =
    !!promobar && (!promobar.enabled || !promobar.messages?.length);

  return {
    promobarDisabled,
    promobarHeight: PROMOBAR_HEIGHT,
    promobarHidden,
    setPromobarHidden,
  };
}
