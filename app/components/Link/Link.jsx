import {forwardRef, useMemo} from 'react';
import {Link as RemixLink} from '@remix-run/react';

import {useLocale} from '~/hooks';

/* Docs: https://remix.run/docs/en/main/components/link */

const getValidatedHref = ({href, type, pathPrefix}) => {
  if (!href) return '';
  if (type === 'isPage') {
    return `${pathPrefix}${href}`;
  }
  if (type === 'isExternal') {
    if (href.startsWith('/')) return `${pathPrefix}${href}`;
    let externalHref;
    try {
      externalHref = new URL(href).href;
    } catch (error) {
      externalHref = `https://${href}`;
    }
    return externalHref;
  }
  if (type === 'isEmail') {
    return href.startsWith('mailto:') ? href : `mailto:${href}`;
  }
  if (type === 'isPhone') {
    return href.startsWith('tel:') ? href : `tel:${href}`;
  }
  return href;
};

export const Link = forwardRef(
  (
    {
      children,
      className,

      // html property
      href = '',

      // cms property
      isExternal = false,

      newTab = false,

      // remix property
      prefetch = 'intent',

      // remix property
      preventScrollReset = false,

      // remix property
      relative,

      // remix property
      reloadDocument = false,

      // remix property
      replace = false,

      // remix property
      state,

      // cms property
      text = '',

      // remix property
      to = '',

      // cms property
      type = 'isPage',

      // cms property
      url = '',

      ...props
    },
    ref,
  ) => {
    const {pathPrefix} = useLocale();
    const initialHref = to || href || url;

    const finalHref = useMemo(() => {
      return getValidatedHref({
        href: initialHref,
        type: isExternal ? 'isExternal' : type,
        pathPrefix,
      });
    }, [initialHref, isExternal, pathPrefix, type]);

    return finalHref ? (
      <RemixLink
        className={className}
        prefetch={prefetch}
        preventScrollReset={preventScrollReset}
        ref={ref}
        relative={relative}
        reloadDocument={reloadDocument}
        replace={replace}
        state={state}
        to={finalHref}
        {...(newTab ? {target: '_blank'} : null)}
        {...props}
      >
        {children || text}
      </RemixLink>
    ) : (
      <div className={className} ref={ref} {...props}>
        {children || text}
      </div>
    );
  },
);

Link.displayName = 'Link';
