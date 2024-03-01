import {customerActivateClient} from '~/lib/customer';

const getActivateFormError = (error, context) => {
  if (context.storefront.isApiError(error)) {
    return 'Something went wrong. Please try again later.';
  } else {
    return 'Sorry. We could not activate your account.';
  }
};

export const customerActivateAction = async ({request, context}) => {
  const data = {
    errors: null,
    formErrors: null,
  };
  try {
    const body = await request.formData();
    const customerId = String(body.get('customerId') || '');
    const activationToken = String(body.get('activationToken') || '');
    const password = String(body.get('password') || '');

    const {errors} = await customerActivateClient(context, {
      customerId,
      activationToken,
      password,
    });

    if (errors?.length) {
      console.error('customerActivate:errors', errors);
      data.errors = errors;
      data.formErrors = errors;
      return {data, status: 400};
    }

    return {data, status: 200};
  } catch (error) {
    console.error('customerActivateAction:error', error);
    data.errors = [error];
    data.formErrors = [getActivateFormError(error, context)];
    return {data, status: 500};
  }
};
