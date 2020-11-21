const getEndpoint = async () => {
  try {
    const subscription = await self.registration.pushManager.getSubscription();
    if (subscription) {
      console.log("subscription", subscription);
      return subscription.endpoint;
    }
  } catch (error) {
    console.log(error);
    throw new Error("User not subscribed");
  }
};

self.addEventListener("push", event => {
  self.registration.showNotification("TABSO", {
    body: event.data.text(),
    vibrate: [300, 100, 300, 100, 100]
  });
});
