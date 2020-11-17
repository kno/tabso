/* eslint-disable */
import { Workbox } from "workbox-window";

let wb;

if ("serviceWorker" in navigator) {
  wb = new Workbox(`${process.env.BASE_URL}service-worker.js`);

  wb.addEventListener("controlling", () => {
    console.log("controlling");
    window.location.reload();
  });
  wb.addEventListener("push", () => {
    console.log("push");
  });

  wb.register();
} else {
  wb = null;
}

navigator.serviceWorker.ready
  .then(registration => {
    return registration.pushManager.getSubscription()
      .then(async subscription => {
        if (subscription) {
          return subscription;
        }

        const response = await fetch("http://localhost:3000/notifications/vapidPublicKey");
        console.log("response", response);
        const vapidPublicKey = await response.json();
        console.log("vapidPublicKey", vapidPublicKey);
        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey.publicKey);
        console.log("converted", convertedVapidKey);

        return registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey
        });
      });
  }).then(subscription => {
    fetch("http://localhost:3000/notifications/register", {
      method: "post",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        subscription: subscription
      })
    });
  });

export default wb;

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  console.log("base64", base64.length);

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
