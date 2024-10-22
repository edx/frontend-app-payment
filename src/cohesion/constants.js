export const ElementType = {
  Link: 'LINK',
  Entry: 'ENTRY',
  Button: 'BUTTON',
};

export const PaymentTitle = 'Payment | edX';

export const EventMap = {
  ProductClicked: 'redventures.ecommerce.v1.ProductClicked',
  ProductLoaded: 'redventures.ecommerce.v1.ProductLoaded',
  ProductViewed: 'redventures.ecommerce.v1.ProductViewed',
  ElementClicked: 'redventures.usertracking.v3.ElementClicked',
  ElementViewed: 'redventures.usertracking.v3.ElementViewed',
  FieldSelected: 'redventures.usertracking.v3.FieldSelected',
  FormSubmitted: 'redventures.usertracking.v3.FormSubmitted',
  FormViewed: 'redventures.usertracking.v3.FormViewed',
};

export const IS_FULLY_SHOWN_THRESHOLD_OR_MARGIN = 1.0;
export const IS_SINGLE_PX_SHOWN_THRESHOLD_OR_MARGIN = 0.0;
export const DOCUMENT_ROOT_NODE = null;

export const defaultOptions = {
  threshold: IS_FULLY_SHOWN_THRESHOLD_OR_MARGIN,
  root: DOCUMENT_ROOT_NODE,
};
