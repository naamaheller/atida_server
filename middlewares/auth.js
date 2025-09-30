const jwt = require('jsonwebtoken');

exports.auth = async (req, res, next) => {
    let token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        let tokenData = jwt.verify(token, process.env.TOKEN_SECRET);
        req.tokenData = tokenData;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Access denied. Invalid token.' });
    }
};

exports.authAdmin = (req, res, next) => {
    let token = req.header("Authorization"); // במקום x-api-key
    if (!token) {
        return res.status(401).json({ msg: "You need to send token to this endpoint url 7777" });
    }

    try {
        let decodeToken = jwt.verify(token, process.env.TOKEN_SECRET);

        if (decodeToken.role !== "admin") {
            return res.status(401).json({ msg: "Token invalid or not admin, code: 6A" });
        }

        req.tokenData = decodeToken;
        next();
    }
    catch (err) {
        console.log(err);
        return res.status(401).json({ msg: "Token invalid or expired, log in again or you hacker!" });
    }
};

