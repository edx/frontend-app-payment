import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { trackElementIntersection } from '../../data/actions';
import { ElementType, IS_FULLY_SHOWN_THRESHOLD_OR_MARGIN } from '../../../cohesion/constants';

import PayPalLogo from './assets/paypal-logo.png';
import messages from './PayPalButton.messages';

const PayPalButton = ({ intl, isProcessing, ...props }) => {
  const buttonRef = useRef(null);
  const dispatch = useDispatch();

  // RV event tracking for PayPal Button
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const elementId = entry.target?.id;
          const tagularElement = {
            elementType: ElementType.Button,
            position: String(elementId || ''),
            name: 'paypal',
            text: 'PayPal',
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
    <button type="button" {...props} ref={buttonRef}>
      { isProcessing ? <span className="button-spinner-icon text-primary mr-2" /> : null }
      <img
        src={PayPalLogo}
        alt={intl.formatMessage(messages['payment.type.paypal'])}
      />
    </button>
  );
};

PayPalButton.propTypes = {
  intl: intlShape.isRequired,
  isProcessing: PropTypes.bool,
};

PayPalButton.defaultProps = {
  isProcessing: false,
};

export default injectIntl(PayPalButton);
