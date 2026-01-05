const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({
    origin: ['https://ваш-frontend.vercel.app', 'https://web.telegram.org', 'https://t.me'],
    credentials: true
}));

// Тест
app.get('/', (req, res) => res.json({status: 'Backend OK! 🟢'}));

// Функция хэша пользователя
function getUserHash(initData) {
    return initData ? initData.split('&')[0] || 'anon' : 'anon';
}

// Загрузка пользователя (local storage пока)
app.post('/api/user', (req, res) => {
    const hash = getUserHash(req.body.initData);
    // ВРЕМЕННО local (замените на MongoDB позже)
    const users = {}; // или global users = {}
    const user = users[hash] || {tokens: 0, health: 100, infected: false};
    res.json(user);
});

// Тап с вирусом
app.post('/api/tap', (req, res) => {
    const hash = getUserHash(req.body.initData);
    const users = {}; // Замените на MongoDB
    const user = users[hash] || {tokens: 0, health: 100, infected: false};
    
    // 10% шанс заражения
    const infected = Math.random() < 0.1;
    if (infected) {
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
        users[hash] = user;
    }
    res.json(user);
});

// Задания
app.post('/api/task', (req, res) => {
    const hash = getUserHash(req.body.initData);
    const users = {};
    const user = users[hash] || {tokens: 0};
    user.tokens += 50;
    users[hash] = user;
    res.json({tokens: user.tokens, message: '+50 за задание! 🎉'});
});

// ЭКСПОРТ ДЛЯ VERCEL (ОБЯЗАТЕЛЬНО!)
module.exports = app;
