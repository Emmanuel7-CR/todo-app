// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.3.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.3.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDfT-dd5B30EcCeHHbZ-iIzRwVg1sLP0ek",
  authDomain: "todo-reminder-app-6cab6.firebaseapp.com",
  projectId: "todo-reminder-app-6cab6",
  messagingSenderId: "361450721360",
  appId: "1:361450721360:web:acaff1832005963e9c0155"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  console.log('📨 Received background message: ', payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: 'icons/icon-192.png'
  });
});
