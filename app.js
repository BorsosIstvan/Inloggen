const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs'); // Importeer de fs-module

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Functie om berichten naar het JSON-bestand te schrijven
function saveMessage(message) {
  fs.readFile(__dirname + 'data' + 'messages.json', (err, data) => {
    if (err) throw err;
    let messages = JSON.parse(data);
    messages.push(message);
    fs.writeFile(__dirname + 'data' + 'messages.json', JSON.stringify(messages), (err) => {
      if (err) throw err;
      console.log('Bericht opgeslagen in messages.json');
    });
  });
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/templates' + '/index.html');
});

// Houd bij welke gebruikers zijn ingelogd
const users = {};

io.on('connection', (socket) => {
  console.log('Een gebruiker is verbonden');

  // Stuur een welkomstbericht naar de nieuwe gebruiker
  socket.emit('message', 'Welkom bij de chat!');

  // Luister naar berichten van de gebruiker
  socket.on('message', (message) => {
    // Stuur het bericht naar alle verbonden gebruikers
    io.emit('message', message);
    saveMessage(message); // Roep de functie aan om het bericht op te slaan
  });

  // Luister naar inloggegevens van de gebruiker
  socket.on('login', (username) => {
    // Voeg de gebruiker toe aan de lijst met ingelogde gebruikers
    users[socket.id] = username;
    // Stuur een bericht naar alle gebruikers dat iemand is ingelogd
    io.emit('message', `${username} is ingelogd`);
  });

  // Luister naar het verbreken van de verbinding
  socket.on('disconnect', () => {
    const username = users[socket.id];
    // Verwijder de gebruiker uit de lijst met ingelogde gebruikers
    delete users[socket.id];
    // Stuur een bericht naar alle gebruikers dat iemand is uitgelogd
    io.emit('message', `${username} is uitgelogd`);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server luistert op poort ${PORT}`);
});
