const express = require('express');
const app = express();
const http = require('http').createServer(app);

// Serve static files from the 'static' directory
app.use(express.static('static'));

// Route for the home page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/templates/index.html');
});

// Start the server
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
