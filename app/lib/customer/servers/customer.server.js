import {customerGetClient} from '~/lib/customer';

export const customerGetAction = async ({context}) => {
  const data = {
    errors: null,
    customer: null,
  };
  try {
    const customerAccessToken = await context.session.get(
      'customerAccessToken',
    );

    if (!customerAccessToken) {
      data.errors = ['Cannot find customer access token'];
      return {data, status: 401};
    }

    const {errors, response} = await customerGetClient(context, {
      customerAccessToken,
    });

    if (errors?.length) {
      console.error('customerGetClient:errors', errors);
      data.errors = errors;
      return {data, status: 400};
    }
    if (response?.customer) {
      data.customer = response.customer;
    }

    return {data, status: 200};
  } catch (error) {
    console.error('customerGetAction:error', error);
    data.errors = [error];
    return {data, status: 500};
  }
};
