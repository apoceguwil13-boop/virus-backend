module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Content-Type', 'application/json');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    
    const path = req.url.split('?')[0];
    const hash = req.body?.initData?.split('&')[0] || 'user';
    
    if (path === '/api/tap' && req.method === 'POST') {
        return res.json({tokens: Math.floor(Math.random()*10)+1, health: 95, infected: Math.random()<0.1});
    }
    if (path === '/api/roulette' && req.method === 'POST') {
        return res.json({tokens: Math.random()>0.5 ? 40 : 0, message: Math.random()>0.5 ? 'Выиграл!' : 'Проиграл'});
    }
    if (path === '/api/task' && req.method === 'POST') {
        return res.json({tokens: 50, message: '+50! 🎉'});
    }
    
    res.json({status: 'Backend OK'});
};
