module.exports = (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});
    
    const initData = req.body.initData || '';
    const hash = initData.split('&')[0] || 'user';
    
    // Симуляция пользователя (потом MongoDB)
    const users = {}; 
    const user = users[hash] || {tokens: 20};
    
    if (user.tokens >= 10) {
        const win = Math.random() > 0.5;
        user.tokens = win ? user.tokens * 2 : user.tokens - 10;
        users[hash] = user;
    }
    
    res.json(user);
};
