import {redirect} from '@shopify/remix-oxygen';

export async function cusomterLogout(context) {
  const {session} = context;
  session.unset('customerAccessToken');

  // The only file to explicitly type cast i18n to pass typecheck
  return redirect(`${context.storefront.i18n.pathPrefix}/account/login`, {
    headers: {
      'Set-Cookie': await session.commit(),
    },
  });
}

export async function loader({context}) {
  return redirect(`${context.storefront.i18n.pathPrefix}/account/login`);
}

export const action = async ({context}) => {
  return cusomterLogout(context);
};
