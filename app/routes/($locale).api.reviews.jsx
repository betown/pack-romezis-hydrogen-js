import {json} from '@shopify/remix-oxygen';

/*
 * example api call to third party; repurpose as needed
 */
const getProductReviewAggregate = async ({productId, PLATFORM_KEY}) => {
  const endpoint = `https://api.example-platform.com/products/${PLATFORM_KEY}/${encodeURIComponent(
    productId,
  )}/review_aggregate`;
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  };
  const response = await fetch(endpoint, options);
  return response.json();
};

export async function action({request, context}) {
  let body;
  try {
    body = await request.formData();
  } catch (error) {}
  const action = String(body?.get('action') || '');

  const actions = {
    getProductReviewAggregate,
  };
  const reviewsAction = actions[action];

  if (!reviewsAction) {
    return json({error: '/api/reviews: Unsupported action'}, {status: 400});
  }

  const productId = String(body?.get('productId') || '');
  const env = context.env;
  const PLATFORM_KEY = env.EXAMPLE_PLATFORM_KEY;

  if (!productId) {
    return json(
      {error: '/api/reviews: Missing productId in request'},
      {status: 400},
    );
  }

  const data = await reviewsAction({productId, PLATFORM_KEY, body});

  if (!data || data.error) {
    return json(
      {error: data.error || '/api/reviews: Something went wrong'},
      {status: 500},
    );
  }

  return json({...data});
}
