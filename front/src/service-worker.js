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
  console.log(event);
  event.waitUntil(
    getEndpoint()
      .then(function(endpoint) {
        console.log("endpoint", endpoint);
        return fetch("http://localhost:3000/notifications/getPayload?endpoint=" + endpoint);
      })
      .then(function(response) {
        return response.text();
      })
      .then(function(payload) {
        console.log(payload);
        self.registration.showNotification("ServiceWorker Cookbook", {
          body: payload + "A saber"
        });
      })
  );
});
