import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { fireEvent, render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import AlertMessage from './AlertMessage';
import { MESSAGE_TYPES } from './data/constants';

import '../mockIntersectionObserver';

const mockStore = configureMockStore();

describe('AlertMessage', () => {
  // The AlertList test covers most of AlertMessage testing.
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

  it('should handle closing', () => {
    const closeHandlerMock = jest.fn();

    const component = (
      <IntlProvider locale="en">
        <Provider store={store}>
          <AlertMessage
            id={123}
            messageType={MESSAGE_TYPES.ERROR}
            userMessage="Wondrous message!"
            closeHandler={closeHandlerMock}
          />
        </Provider>
      </IntlProvider>
    );

    const { container } = render(component);
    const button = container.querySelector('.btn');
    fireEvent.click(button);

    expect(closeHandlerMock).toHaveBeenCalledWith(123);
  });

  it('should default its severity when necessary', () => {
    const closeHandlerMock = jest.fn();

    const component = (
      <IntlProvider locale="en">
        <Provider store={store}>
          <AlertMessage
            id={123}
            messageType="unknown"
            userMessage="Wondrous message!"
            closeHandler={closeHandlerMock}
          />
        </Provider>
      </IntlProvider>
    );

    const { container: tree } = render(component);
    // The alert should have an 'alert-warning' class.  That's the default in the code.
    expect(tree).toMatchSnapshot();
  });

  it('should render a userMessage function', () => {
    const component = (
      <IntlProvider locale="en">
        <Provider store={store}>
          <AlertMessage
            id={123}
            userMessage={() => 'Wondrous message!'}
            closeHandler={jest.fn()}
          />
        </Provider>
      </IntlProvider>
    );

    const { container: tree } = render(component);
    expect(tree).toMatchSnapshot();
  });

  it('should render a userMessage element', () => {
    const component = (
      <IntlProvider locale="en">
        <Provider store={store}>
          <AlertMessage
            id={123}
            userMessage={<span>Wondrous message!</span>}
            closeHandler={jest.fn()}
          />
        </Provider>
      </IntlProvider>
    );

    const { container: tree } = render(component);
    expect(tree).toMatchSnapshot();
  });
});
