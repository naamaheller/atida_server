const jwt = require('jsonwebtoken');

exports.auth = async (req, res, next) => {
    let token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    if (token.startsWith("Bearer ")) {
        token = token.replace("Bearer ", "");
    }

    try {
        let tokenData = jwt.verify(token, 'mormor_key');
        req.tokenData = tokenData;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Access denied. Invalid token.' });
    }
};
