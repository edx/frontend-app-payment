import EventMap from './constants';

/**
 * Submit ('beam') an event via Tagular to Make
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

export function pageTrackingObject(pageType) {
  return {
    title: window.document.title,
    url: window.location.href,
    pageType,
    referrer: window.document.referrer,
  };
}
