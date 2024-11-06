import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from '@edx/frontend-platform/i18n';
import { StatefulButton } from '@openedx/paragon';
import { trackElementIntersection } from '../../data/actions';
import { ElementType, PaymentTitle, IS_FULLY_SHOWN_THRESHOLD_OR_MARGIN } from '../../../cohesion/constants';

const PlaceOrderButton = ({
  showLoadingButton, onSubmitButtonClick, stripeSelectedPaymentMethod, disabled, isProcessing,
}) => {
  let submitButtonState = 'default';
  // istanbul ignore if
  if (disabled) { submitButtonState = 'disabled'; }
  // istanbul ignore if
  if (isProcessing) { submitButtonState = 'processing'; }

  const buttonRef = useRef(null);
  const dispatch = useDispatch();

  // RV event tracking for Place Order Button
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const tagularElement = {
            title: PaymentTitle,
            url: window.location.href,
            pageType: 'checkout',
            elementType: ElementType.Button,
            position: 'placeOrderButton',
            name: 'stripe',
            text: 'Stripe',
          };
          dispatch(trackElementIntersection(tagularElement));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: IS_FULLY_SHOWN_THRESHOLD_OR_MARGIN,
    });

    const currentElement = buttonRef.current;

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
      observer.disconnect();
    };
  }, [dispatch]);

  return (
    <div className="col-lg-6 form-group float-right">
      <div className="row justify-content-end mt-4" ref={buttonRef}>
        {
        showLoadingButton ? (
          <div className="skeleton btn btn-block btn-lg">&nbsp;</div>
        ) : (
          <StatefulButton
            type="submit"
            id="placeOrderButton"
            variant="primary"
            size="lg"
            block
            state={submitButtonState}
            onClick={() => onSubmitButtonClick(stripeSelectedPaymentMethod)}
            labels={{
              default: (
                <FormattedMessage
                  id="payment.form.submit.button.text"
                  defaultMessage="Place Order"
                  description="The label for the payment form submit button"
                />
              ),
            }}
            icons={{
              processing: (
                <span className="button-spinner-icon" />
              ),
            }}
            disabledStates={['processing', 'disabled']}
          />
        )
    }
      </div>
    </div>
  );
};

PlaceOrderButton.propTypes = {
  onSubmitButtonClick: PropTypes.func.isRequired,
  stripeSelectedPaymentMethod: PropTypes.string,
  showLoadingButton: PropTypes.bool,
  disabled: PropTypes.bool,
  isProcessing: PropTypes.bool,
};

PlaceOrderButton.defaultProps = {
  showLoadingButton: false,
  stripeSelectedPaymentMethod: null,
  disabled: false,
  isProcessing: false,
};

export default injectIntl(PlaceOrderButton);
