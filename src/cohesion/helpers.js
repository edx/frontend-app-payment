import Cookies from 'universal-cookie';
import { v4 as uuidv4 } from 'uuid';
import { EventMap } from './constants';

/**
 * Fetch or Create a Tagular CorrelationID. This also refreshes the cookie's expiry.
 */
export const getCorrelationID = () => {
  const COOKIE_NAME = 'tglr_correlation_id';
  const PARAM_NAME = 'correlationId';

  function getDomain() {
    const { hostname } = window.location;
    const parts = hostname.split('.');
    return parts.length > 2 ? parts.slice(-2).join('.') : hostname;
  }

  function getQueryParameter(name) {
    const params = new URLSearchParams(window.location.search);

    return params.get(name);
  }

  let paramId = getQueryParameter(PARAM_NAME) || new Cookies().get(COOKIE_NAME);

  if (!paramId) {
    paramId = uuidv4();
  }

  // If the tagular correlation ID cookie was set before we added the change to
  // specify the domain, it was automatically added to the current domain.
  // Always delete the cookie with the current domain
  new Cookies().remove(COOKIE_NAME, { domain: window.location.hostname, path: '/' });

  const expirationDate = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() + 30); // 30 mins expiration from now
  new Cookies().set(COOKIE_NAME, paramId, { expires: expirationDate, domain: `.${getDomain()}`, path: '/' });

  return paramId;
};

/**
 * Submit ('beam') an event via Tagular to Make.
 * @param eventName Schema Name of the Event
 * @param eventData The data required by the schema
 */
export const tagularEvent = (eventName, eventData) => {
  // if tagular is available, try sending given event with event data
  if (typeof window !== 'undefined' && window.tagular) {
    try {
      window.tagular('beam', eventName, {
        '@type': EventMap[eventName],
        ...eventData,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(`Tagular event ${eventName} not sent.`, error);
    }
  } else {
    // eslint-disable-next-line no-console
    console.warn('Tagular not available on page.');
  }
};

/**
 * Make Near Slugs from Plain Strings for ease of eventing.
 * @example
 *   "Computer Science" => "computer-science"
 *   "Humanities & Arts" => "humanities-&-arts"
 *   "Someone added a space " => "someone-added-a-space"
 *
 * @param x Input String
 */
export function hyphenateForTagular(x) {
  return x
    .trim()
    .toLowerCase()
    .replace(/[^\w&]/g, '-');
}
