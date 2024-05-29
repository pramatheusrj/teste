// Configurações do Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Inicializa o FCM
const messaging = firebase.messaging();

// Solicita permissão para notificações
function requestPermission() {
  messaging.requestPermission()
    .then(() => {
      console.log('Notification permission granted.');
      return messaging.getToken();
    })
    .then((token) => {
      console.log('FCM Token:', token);
      // Envie o token para o servidor ou salve para uso futuro
    })
    .catch((err) => {
      console.log('Unable to get permission to notify.', err);
    });
}

// Envia uma notificação ao servidor
function sendNotification(doctorName, subject) {
  fetch('/alert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ doctorName, subject })
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.message);
  });
}

document.getElementById('alertForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const doctorName = document.getElementById('doctorName').value;
  const subject = document.getElementById('subject').value;
  sendNotification(doctorName, subject);
});

// Solicita permissão para notificações ao carregar a página
requestPermission();

// Recebe mensagens enquanto o app está em primeiro plano
messaging.onMessage((payload) => {
  console.log('Message received. ', payload);
  // Personalize a notificação aqui
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon
  };

  new Notification(notificationTitle, notificationOptions);
});
