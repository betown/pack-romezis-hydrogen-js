import {useCallback, useEffect, useState} from 'react';
import {useCart} from '@shopify/hydrogen-react';
import {useSiteSettings} from '@pack/react';
import {useGlobal} from '~/hooks';

export function useAddToCart({
  addToCartText: addToCartTextOverride = '',
  attributes,
  quantity = 1,
  selectedVariant = null,
  sellingPlanId,
}) {
  const {error, linesAdd, status} = useCart();
  const siteSettings = useSiteSettings();
  const {openCart, openModal} = useGlobal();

  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const enabledNotifyMe = siteSettings?.settings?.product?.backInStock?.enabled;
  const variantIsSoldOut = selectedVariant && !selectedVariant.availableForSale;
  const variantIsPreorder = !!selectedVariant?.currentlyNotInStock;

  let buttonText = '';
  if (variantIsPreorder) {
    buttonText =
      siteSettings?.settings?.product?.addToCart?.preorderText || 'Preorder';
  } else if (variantIsSoldOut) {
    buttonText = enabledNotifyMe
      ? siteSettings?.settings?.product?.backInStock?.notifyMeText ||
        'Notify Me'
      : siteSettings?.settings?.product?.addToCart?.soldOutText || 'Sold Out';
  } else {
    buttonText =
      addToCartTextOverride ||
      siteSettings?.settings?.product?.addToCart?.addToCartText ||
      'Add To Cart';
  }

  const cartIsUpdating = status === 'creating' || status === 'updating';

  const handleAddToCart = useCallback(() => {
    if (!selectedVariant?.id || isAdding || cartIsUpdating) return;
    setIsAdding(true);
    linesAdd([
      {
        attributes,
        merchandiseId: selectedVariant.id,
        quantity,
        sellingPlanId,
      },
    ]);
  }, [
    attributes,
    isAdding,
    linesAdd,
    quantity,
    selectedVariant?.id,
    sellingPlanId,
    status,
  ]);

  const handleNotifyMe = useCallback(
    (component) => {
      if (!selectedVariant?.id) return;
      openModal(component);
    },
    [selectedVariant?.id],
  );

  useEffect(() => {
    if (isAdding && status === 'idle') {
      setIsAdding(false);
      setIsAdded(true);
      openCart();
      setTimeout(() => setIsAdded(false), 1000);
    }
  }, [status, isAdding]);

  useEffect(() => {
    if (!error) return;
    console.error('@shopify/hydrogen-react:useCart', error);
  }, [error]);

  return {
    buttonText,
    cartIsUpdating, // cart is updating
    handleAddToCart,
    handleNotifyMe,
    isAdded, // line is added (true for only a second)
    isAdding, // line is adding
    isNotifyMe: !!variantIsSoldOut && enabledNotifyMe,
    isSoldOut: !!variantIsSoldOut,
    subtext: siteSettings?.settings?.product?.addToCart?.subtext,
  };
}
