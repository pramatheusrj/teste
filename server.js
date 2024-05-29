const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());

const SERVER_KEY = 'YOUR_SERVER_KEY';

app.post('/alert', (req, res) => {
  const { doctorName, subject } = req.body;
  const message = {
    notification: {
      title: `Alerta de ${doctorName}`,
      body: subject
    },
    to: 'RECIPIENT_FCM_TOKEN' // Substitua pelo token FCM do destinatário
  };

  fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      'Authorization': `key=${SERVER_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Notification sent successfully:', data);
    res.status(200).send({ message: 'Notification sent successfully' });
  })
  .catch(error => {
    console.error('Error sending notification:', error);
    res.status(500).send({ message: 'Error sending notification' });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
