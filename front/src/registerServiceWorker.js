/* eslint-disable */
import req from "./util/req";
let wb;

if ('serviceWorker' in navigator) {
  wb = navigator.serviceWorker.register(`${process.env.BASE_URL}service-worker.js`);
}

const Register = () => {
  navigator.serviceWorker.ready
    .then(registration => {
      return registration.pushManager.getSubscription()
        .then(async subscription => {
          if (subscription) {
            console.log("existe subscripción", subscription);
            return subscription;
          }

          const response = await req("get", "notifications/vapidPublicKey");
          const convertedVapidKey = urlBase64ToUint8Array(response.data.publicKey);

          return registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey
          });
        });
    }).then(subscription => {
      req("post", "notifications/register", subscription);
    });
  }

export {Register};
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
