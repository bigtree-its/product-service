const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    console.log('Verifying security token...');
    console.log('headers ' + JSON.stringify(req.headers));
    const bearerHeader = req.headers['Authorization'] || req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        // call next middleware
        next();
    } else {
        console.log('Unauthorized!');
        res.sendStatus(401);
    }
}

module.exports.verifyToken = verifyToken;