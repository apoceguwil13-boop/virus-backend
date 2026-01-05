const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

let users = {}; // users[hash(initData)] = {tokens:0, health:100}

app.post('/api/tap', (req, res) => {
    const initDataHash = req.body.initData; // Хэш для user ID
    const user = users[initDataHash] || {tokens: 0, health: 100};
    user.tokens += Math.floor(Math.random() * 10) + 1;
    user.health = Math.max(0, user.health - Math.random() * 5);
    users[initDataHash] = user;
    res.json(user);
});

app.post('/api/roulette', (req, res) => {
    const initDataHash = req.body.initData;
    const user = users[initDataHash];
    if (user.tokens >= 10) {
        const win = req.body.win;
        user.tokens = win ? user.tokens * 2 : user.tokens - 10;
    }
    res.json(user);
});

app.listen(3000);
