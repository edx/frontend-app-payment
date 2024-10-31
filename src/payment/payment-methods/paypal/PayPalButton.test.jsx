import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import '../../../mockIntersectionObserver';

import PayPalButton from './PayPalButton';

const mockStore = configureMockStore();

describe('PayPalButton', () => {
  let store;
  let state;

  beforeEach(() => {
    state = {
      userAccount: { email: 'person@example.com' },
      payment: {
        basket: {
          loaded: false,
          loading: false,
          products: [],
        },
      },
      i18n: {
        locale: 'en',
      },
    };

    store = mockStore(state);
  });

  it('should render the button by default', () => {
    const component = (
      <IntlProvider locale="en">
        <Provider store={store}>
          <PayPalButton />
        </Provider>
      </IntlProvider>
    );
    const { container: tree } = render(component);
    expect(tree).toMatchSnapshot();
  });
  it('should render the button with a spinner when processing', () => {
    const component = (
      <IntlProvider locale="en">
        <Provider store={store}>
          <PayPalButton isProcessing />
        </Provider>
      </IntlProvider>
    );
    const { container: tree } = render(component);
    expect(tree).toMatchSnapshot();
  });
});
