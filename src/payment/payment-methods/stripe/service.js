import formurlencoded from 'form-urlencoded';

import { ensureConfig, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';

import { handleApiError } from '../../data/handleRequestError';

ensureConfig(['ECOMMERCE_BASE_URL', 'STRIPE_RESPONSE_URL'], 'Stripe API service');

/**
 * Checkout with Stripe
 *
 * 1. Billing form data was sent to Stripe via PaymentIntent, ecommerce will retrieve this data from Stripe
 * 2. POST request to ecommerce Stripe API with paymentIntent ID
 * 3. Redirect to receipt page
 */
export default async function checkout(
  basket,
  {
    skus, elements, stripe, context, values, stripeSelectedPaymentMethod,
  },
  setLocation = href => { global.location.href = href; }, // HACK: allow tests to mock setting location
) {
  const {
    firstName,
    lastName,
    address,
    unit,
    city,
    country,
    state,
    postalCode,
    organization,
    purchasedForOrganization,
  } = values;

  let shippingAddress;
  if (stripeSelectedPaymentMethod === 'afterpay_clearpay') {
    shippingAddress = {
      address: {
        city,
        country,
        line1: address,
        line2: unit || '',
        postal_code: postalCode || '',
        state: state || '',
      },
      name: `${firstName} ${lastName}`,
    };
  }

  const result = await stripe.updatePaymentIntent({
    elements,
    params: {
      payment_method_data: {
        billing_details: {
          address: {
            city,
            country,
            line1: address,
            line2: unit || '',
            postal_code: postalCode || '',
            state: state || '',
          },
          email: context.authenticatedUser.email,
          name: `${firstName} ${lastName}`,
        },
        metadata: {
          organization,
          purchased_for_organization: purchasedForOrganization,
        },
      },
      // Shipping is required for processing Afterpay payments
      shipping: shippingAddress,
    },
  });

  if (result.error) {
    handleApiError(result.error);
  }

  const { basketId } = basket;
  const postData = formurlencoded({
    payment_intent_id: result.paymentIntent.id,
    skus,
    dynamic_payment_methods_enabled: basket.isDynamicPaymentMethodsEnabled || false,
  });
  await getAuthenticatedHttpClient()
    .post(
      `${process.env.STRIPE_RESPONSE_URL}`,
      postData,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    )
    .then(async response => {
      // If response contains receipt_page_url, it's not a DPM payment
      if (response.data.receipt_page_url) {
        setLocation(response.data.receipt_page_url);
      }
      if (response.data.status === 'requires_action') {
        const { error } = await stripe.handleNextAction({
          clientSecret: response.data.confirmation_client_secret,
        });

        if (error) {
          // Log error and tell user.
          logError(error, {
            messagePrefix: 'Stripe Submit Error',
            paymentMethod: 'Stripe',
            paymentErrorType: 'Submit Error',
            basketId,
          });
          handleApiError(error);
        }
      }
    })
    .catch(error => {
      const errorData = error.response ? error.response.data : null;
      if (errorData && error.response.data.sdn_check_failure) {
        /* istanbul ignore next */
        if (getConfig().ENVIRONMENT !== 'test') {
          // SDN failure: redirect to Ecommerce SDN error page.
          setLocation(`${getConfig().ECOMMERCE_BASE_URL}/payment/sdn/failure/`);
        }
        logError(error, {
          messagePrefix: 'SDN Check Error',
          paymentMethod: 'Stripe',
          paymentErrorType: 'SDN Check Submit Api',
          basketId,
        });
        throw new Error('This card holder did not pass the SDN check.');
      } else {
        // Log error and tell user.
        logError(error, {
          messagePrefix: 'Stripe Submit Error',
          paymentMethod: 'Stripe',
          paymentErrorType: 'Submit Error',
          basketId,
        });
        handleApiError(error);
      }
    });
}
