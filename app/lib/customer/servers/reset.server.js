import {passwordResetClient} from '~/lib/customer';

const getResetFormError = (error, context) => {
  if (context.storefront.isApiError(error)) {
    return 'Something went wrong. Please try again later.';
  } else {
    return 'Sorry. We could not update your password.';
  }
};

export const customerPasswordResetAction = async ({request, context}) => {
  const data = {
    errors: null,
    formErrors: null,
  };
  try {
    const body = await request.formData();
    const password = String(body.get('password' || ''));
    const url = String(body.get('url') || '');

    const {errors} = await passwordResetClient(context, {
      password,
      url,
    });

    if (errors?.length) {
      console.error('passwordResetClient:errors', errors);
      data.errors = errors;
      data.formErrors = errors;
      return {data, status: 400};
    }

    return {data, status: 200};
  } catch (error) {
    console.error('customerPasswordResetAction:error', error);
    data.errors = [error];
    data.formErrors = [getResetFormError(error, context)];
    return {data, status: 500};
  }
};
