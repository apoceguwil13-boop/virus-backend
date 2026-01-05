const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({
    origin: ['https://virus-clone-h59l.vercel.app', 'https://web.telegram.org']
}));

function getUserHash(initData) {
    return initData?.split('&')[0] || 'user';
}

// Тест
app.get('/', (req, res) => res.json({status: 'Backend OK! 🟢'}));

// Загрузка
app.post('/api/user', (req, res) => {
    const hash = getUserHash(req.body.initData);
    const users = {}; // Временно, потом MongoDB
    res.json(users[hash] || {tokens: 0, health: 100, infected: false});
});

// Тап
app.post('/api/tap', (req, res) => {
    const hash = getUserHash(req.body.initData);
    const users = {};
    const user = users[hash] || {tokens: 0, health: 100, infected: false};
    
    if (Math.random() < 0.1) {
        user.infected = true;
        user.health -= 20;
    }
    user.tokens += Math.floor(Math.random() * 5) + 1;
    user.health = Math.max(0, Math.min(100, user.health));
    
    users[hash] = user;
    res.json(user);
});

// Рулетка
app.post('/api/roulette', (req, res) => {
    const hash = getUserHash(req.body.initData);
    const users = {};
    const user = users[hash] || {tokens: 0};
    
    if (user.tokens >= 10) {
        const win = Math.random() > 0.5;
        user.tokens = win ? user.tokens * 2 : user.tokens - 10;
    }
    res.json(user);
});

// Задания
app.post('/api/task', (req, res) => {
    const hash = getUserHash(req.body.initData);
    const users = {};
    const user = users[hash] || {tokens: 0};
    user.tokens += 50;
    res.json({tokens: user.tokens, message: '+50! 🎉'});
});

module.exports = app;
