import React, {
  useCallback, useEffect, useRef,
} from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Alert } from '@openedx/paragon';
import { ALERT_TYPES, MESSAGE_TYPES } from './data/constants';
import { trackElementIntersection } from '../payment/data/actions';
import { ElementType, IS_FULLY_SHOWN_THRESHOLD_OR_MARGIN } from '../cohesion/constants';

// Put in a message type, get an alert type.
const severityMap = {
  [MESSAGE_TYPES.DEBUG]: ALERT_TYPES.WARNING,
  [MESSAGE_TYPES.INFO]: ALERT_TYPES.INFO,
  [MESSAGE_TYPES.SUCCESS]: ALERT_TYPES.SUCCESS,
  [MESSAGE_TYPES.WARNING]: ALERT_TYPES.WARNING,
  [MESSAGE_TYPES.ERROR]: ALERT_TYPES.DANGER,
};

const AlertMessage = (props) => {
  const {
    id, messageType, userMessage, closeHandler, data,
  } = props;

  const alertRef = useRef(null);
  const dispatch = useDispatch();

  // RV promo banner tracking for successful coupon application
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target?.innerText.includes('added to basket')) {
          const tagularElement = {
            elementType: ElementType.Button,
            name: 'promotional-code',
            text: 'Apply',
          };
          dispatch(trackElementIntersection(tagularElement));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: IS_FULLY_SHOWN_THRESHOLD_OR_MARGIN,
    });

    const currentElement = alertRef.current;

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
      observer.disconnect();
    };
  }, [messageType, userMessage, dispatch]);

  const statusAlertProps = {
    variant: ALERT_TYPES.WARNING,
    onClose: useCallback(() => { closeHandler(id); }, [closeHandler, id]),
    show: true,
  };

  if (messageType !== null && severityMap[messageType] !== undefined) {
    statusAlertProps.variant = severityMap[messageType];
  }

  // The user message can be a
  // - React component definition (we must create it with props)
  // - React element instance (we must clone it with props)
  // - A string or number (we will render this as is)
  if (typeof userMessage === 'function') {
    statusAlertProps.dialog = React.createElement(userMessage, { values: data });
  } else if (React.isValidElement(userMessage)) {
    statusAlertProps.dialog = React.cloneElement(userMessage, {
      ...userMessage.props,
      values: { ...data, ...userMessage.props.values },
    });
  } else {
    statusAlertProps.dialog = userMessage;
  }

  return (
    <div ref={alertRef} id={userMessage}>
      <Alert {...statusAlertProps} dismissible>
        {statusAlertProps.dialog}
      </Alert>
    </div>
  );
};

AlertMessage.propTypes = {
  id: PropTypes.number.isRequired,
  messageType: PropTypes.string,
  userMessage: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  closeHandler: PropTypes.func.isRequired,
  data: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

AlertMessage.defaultProps = {
  userMessage: null,
  messageType: undefined,
  data: {},
};

export default AlertMessage;
