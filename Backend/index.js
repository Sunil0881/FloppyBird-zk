const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// Global variable to store high score
let highScore = 0;

app.use(cors());
app.use(bodyParser.json());

// Endpoint to get the current high score
app.get('/highscore', (req, res) => {
    res.json({ highScore });
});

// Endpoint to update the high score if the new score is higher
app.post('/highscore', (req, res) => {
    const { score } = req.body;
    if (score > highScore) {
        highScore = score;
        return res.status(200).json({ message: 'New high score!', highScore });
    }
    res.status(200).json({ message: 'Score not high enough.', highScore });
});

// Start the server on port 5000
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
