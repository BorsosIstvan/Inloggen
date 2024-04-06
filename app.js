const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

let currentUser = '';

// Index pagina
app.get('/', (req, res) => {
    res.render('index');
});

// Inloggen
app.post('/login', (req, res) => {
    const { username } = req.body;
    currentUser = username;
    res.redirect('/klats');
});

// Klats pagina
app.get('/klats', (req, res) => {
    res.render('klats', { username: currentUser });
});

// Uitloggen
app.post('/logout', (req, res) => {
    currentUser = '';
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Klats app luistert op http://localhost:${port}`);
});
