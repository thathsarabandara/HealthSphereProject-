// authEvents.js
export const triggerLoginEvent = () => {
    const event = new Event("userLogin");
    window.dispatchEvent(event);
  };
  