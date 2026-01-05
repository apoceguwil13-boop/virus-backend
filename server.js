const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({origin: true}));

{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}

const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;  // ← Vercel добавил!
let db;

MongoClient.connect(uri).then(client => {
    db = client.db('virusdb');
    console.log('MongoDB ready!');
});

app.post('/api/tap', async (req, res) => {
    const hash = getUserHash(req.body.initData);
    const user = await db.collection('users').findOneAndUpdate(
        { hash },
        { 
            $inc: { tokens: Math.floor(Math.random()*5)+1 },
            $set: { 
                health: Math.max(0, Math.min(100, (await db.collection('users').findOne({hash}))?.health - 5 || 95)),
                infected: Math.random() < 0.1,
                updated_at: new Date()
            }
        },
        { upsert: true, returnDocument: 'after' }
    );
    res.json(user.value);
});

function getUserHash(initData) {
    return initData.split('&')[0]; // Упрощённо, в проде используйте crypto
}

// Загрузка пользователя
app.post('/api/user', (req, res) => {
    const hash = getUserHash(req.body.initData);
    users[hash] = users[hash] || {tokens: 0, health: 100, infected: false};
    res.json(users[hash]);
});

// Тап с вирусом
app.post('/api/tap', (req, res) => {
    const hash = getUserHash(req.body.initData);
    const user = users[hash] || {tokens: 0, health: 100, infected: false};
    
    // 10% шанс заражения
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
    const user = users[hash];
    if (user && user.tokens >= 10) {
        const win = Math.random() > 0.5;
        user.tokens = win ? user.tokens * 2 : user.tokens - 10;
        users[hash] = user;
    }
    res.json(user || {tokens: 0});
});

// Задания
app.post('/api/task', (req, res) => {
    const hash = getUserHash(req.body.initData);
    const user = users[hash] || {tokens: 0};
    user.tokens += 50;
    users[hash] = user;
    res.json({tokens: user.tokens, message: '+50 за задание! 🎉'});
});

app.listen(3000, () => console.log('Backend ready'));
