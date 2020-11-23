self.addEventListener("push", event => {
  self.registration.showNotification("TABSO", {
    body: event.data.text(),
    vibrate: [300, 100, 300, 100, 100]
  });
});
