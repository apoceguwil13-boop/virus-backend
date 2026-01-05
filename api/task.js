module.exports = (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});
    
    const initData = req.body.initData || '';
    const hash = initData.split('&')[0] || 'user';
    
    // Симуляция
    const users = {};
    const user = users[hash] || {tokens: 0};
    user.tokens += 50;
    users[hash] = user;
    
    res.json({
        tokens: user.tokens, 
        message: '+50 за задание! 🎉'
    });
};
