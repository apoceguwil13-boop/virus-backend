module.exports = (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});
    
    const initData = req.body.initData || '';
    const hash = initData.split('&')[0] || 'user';
    
    const users = {};
    const user = users[hash] || {tokens: 0, health: 100, infected: false};
    
    res.json(user);
};
