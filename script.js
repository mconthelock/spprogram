(function () {
  //Redirect to full URL
  const host = document.querySelector('meta[name="base_url"]').content;
  const isdomain = host.indexOf("mitsubishielevatorasia.co.th");
  if (isdomain == -1) {
    var s = host.split("/");
    window.location =
      "https://" + s[2] + ".mitsubishielevatorasia.co.th/" + s[3];
  }

  // Swich Theme
  const savedTheme = localStorage.getItem("theme") || "light"; // ค่าเริ่มต้นเป็น 'light'
  document.documentElement.setAttribute("data-theme", savedTheme);
  document.documentElement.setAttribute("class", savedTheme);
  localStorage.setItem("theme", savedTheme);
  document.addEventListener("DOMContentLoaded", function () {
    if (savedTheme === "dark") {
      document.getElementById("theme").checked = true;
    }
  });

  // Register Service worker and Windows Notification
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register(`${host}sw.js`, {
          scope: "./",
        })
        .then((reg) => {
          //console.log("Service Worker registered:", reg);
        })
        .catch((err) =>
          console.error("Service Worker registration failed:", err)
        );
    });
  }

  //   async function subscribeUserToPush() {
  //     const registration = await navigator.serviceWorker.ready;
  //     // Use your VAPID public key
  //     const publicVapidKey =
  //       "BOCGvyaUPTptKO8nFbN8ik4JdygDGatYnEwOkajTCLKmR_kg28Q6kr8Tcxq6JOuf8G6cBIHhvsqkC5I2pfd6T9Y";
  //     const subscription = await registration.pushManager.subscribe({
  //       userVisibleOnly: true,
  //       applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  //     });

  //     // Send this subscription object to your server
  //     await fetch(`${host}notification/subscribe`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(subscription),
  //     });
  //   }

  //   async function unsubscribePush() {
  //     const registration = await navigator.serviceWorker.ready;
  //     const subscription = await registration.pushManager.getSubscription();
  //     if (subscription) {
  //       await subscription.unsubscribe();
  //       console.log("Old subscription removed.");
  //     }
  //   }

  //   function urlBase64ToUint8Array(base64String) {
  //     const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  //     const base64 = (base64String + padding)
  //       .replace(/\-/g, "+")
  //       .replace(/_/g, "/");
  //     const rawData = window.atob(base64);
  //     const outputArray = new Uint8Array(rawData.length);
  //     for (let i = 0; i < rawData.length; ++i) {
  //       outputArray[i] = rawData.charCodeAt(i);
  //     }
  //     return outputArray;
  //   }
})();
