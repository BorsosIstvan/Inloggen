const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Middleware voor het verwerken van formuliergegevens
app.use(bodyParser.urlencoded({ extended: true }));

// Stel de weergave-engine in op ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Statische bestanden serveren vanuit de "public" map
app.use(express.static(path.join(__dirname, 'public')));

// Pad naar JSON-bestanden voor gebruikers en berichten
const usersFilePath = path.join(__dirname, 'data', 'users.json');
const messagesFilePath = path.join(__dirname, 'data', 'messages.json');

// Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/signup', (req, res) => {
    res.render('signup', { title: 'Sign Up' });
});

app.post('/signup', (req, res) => {
    // Verwerk het aanmeldingsverzoek hier
    // Voeg gebruikersgegevens toe aan JSON-bestand
    const newUser = req.body;
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    users.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    res.redirect('/');
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Log In' });
});

app.post('/login', (req, res) => {
    // Verwerk het inlogverzoek hier
    // Voer de nodige validatie en logica uit
    res.redirect('/');
});

app.get('/chat', (req, res) => {
    // Laad de gebruikerslijst en render de chatpagina
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    res.render('chat', { title: 'Chat', users });
});

app.post('/chat', (req, res) => {
    // Verwerk het bericht en voeg het toe aan de berichtenlijst
    // Voeg bericht toe aan JSON-bestand
    const newMessage = req.body;
    const messages = JSON.parse(fs.readFileSync(messagesFilePath));
    messages.push(newMessage);
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
    // Stuur het nieuwe bericht naar alle clients via Socket.IO
    io.emit('new_message', newMessage);
    res.redirect('/chat');
});

// Socket.IO voor real-time communicatie
io.on('connection', (socket) => {
    console.log('Nieuwe verbinding: ' + socket.id);
});

// Start de server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server gestart op port ${PORT}`);
});
