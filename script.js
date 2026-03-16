const checkPermission = () => {

  if (!("serviceWorker" in navigator)) {
    throw new Error("Service Worker not supported");
  }

  if (!("Notification" in window)) {
    throw new Error("Notification API not supported");
  }

};

// register service worker
const registerSW = async () => {

  const registration = await navigator.serviceWorker.register("sw.js");

  console.log("Service Worker Registered");

  return registration;

};

// ask permission
const requestPermission = async () => {

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error("Notification permission not granted");
  }

};

// =============================
// TAB TITLE NOTIFICATION
// =============================

let originalTitle = document.title;
let tabInterval;

const startTabNotification = (message) => {

  if (tabInterval) return; // prevent duplicates

  tabInterval = setInterval(() => {

    document.title =
      document.title === originalTitle
        ? message
        : originalTitle;

  }, 1000);

};

const stopTabNotification = () => {

  clearInterval(tabInterval);
  tabInterval = null;
  document.title = originalTitle;

};

// stop when user returns to tab
document.addEventListener("visibilitychange", () => {

  if (!document.hidden) {
    stopTabNotification();
  }

});


// =============================
// SHOW DESKTOP NOTIFICATION
// =============================

const showNotification = async (options) => {

  const registration = await navigator.serviceWorker.ready;

  registration.showNotification(options.title, {
    body: options.body,
    icon: options.icon,
    badge: options.badge,
    data: {
      url: options.url
    }
  });

  // trigger tab notification
  startTabNotification(`🔔 ${options.title}`);

};


// AUTO RUN
document.addEventListener("DOMContentLoaded", async () => {

  try {

    checkPermission();

    await registerSW();

    await requestPermission();

    await showNotification({
      title: "Hello World",
      body: "This is a test notification",
      icon: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png",
      badge: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png",
      url: "https://youtube.com"
    });

  } catch (error) {

    console.error(error);

  }

});