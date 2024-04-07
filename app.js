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
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'html');

// Statische bestanden serveren vanuit de "public" map
app.use(express.static(path.join(__dirname, 'static')));

// Pad naar JSON-bestanden voor gebruikers en berichten
const usersFilePath = path.join(__dirname, 'data', 'users.json');
const messagesFilePath = path.join(__dirname, 'data', 'messages.json');

// Functie om JSON-bestanden veilig te lezen
function readJsonFile(filePath) {
    try {
        const jsonData = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error('Fout bij het lezen van JSON-bestand:', error.message);
        return null;
    }
}

// Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/signup', (req, res) => {
    res.render('signup', { title: 'Sign Up' });
});

app.post('/signup', (req, res) => {
    const newUser = req.body;
    const users = readJsonFile(usersFilePath) || [];
    users.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    res.redirect('/');
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Log In' });
});

app.post('/login', (req, res) => {
    res.redirect('/');
});

app.get('/chat', (req, res) => {
    const users = readJsonFile(usersFilePath) || [];
    res.render('chat', { title: 'Chat', users });
});

app.post('/chat', (req, res) => {
    const newMessage = req.body;
    const messages = readJsonFile(messagesFilePath) || [];
    messages.push(newMessage);
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
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
