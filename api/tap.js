module.exports = (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});
    
    const initData = req.body.initData || '';
    const hash = initData.split('&')[0] || 'user';
    const user = {tokens: Math.floor(Math.random() * 10) + 1, health: 95, infected: Math.random() < 0.1};
    
    res.json(user);
};
