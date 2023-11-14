const socket = new WebSocket('mongodb://localhost:27017'); // Reemplaza con la URL de tu servidor

socket.addEventListener('open', (event) => {
  console.log('Conexión establecida');
});

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  // Procesa el mensaje recibido y muestra en la interfaz de usuario
  // Por ejemplo, puedes agregar el mensaje a la lista de mensajes en tu chat
});

document.getElementById('send-button').addEventListener('click', () => {
  const messageInput = document.getElementById('message-input');
  const messageText = messageInput.value;
  const message = { text: messageText };

  socket.send(JSON.stringify(message));
  messageInput.value = ''; // Limpia el campo de entrada después de enviar el mensaje
});
