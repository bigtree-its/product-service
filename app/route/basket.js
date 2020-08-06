module.exports = (app) => {
    const basket = require('../controller/basket');
    const { verifyToken } = require('../security/security');
    const { check } = require('express-validator');

    // Retrieve all basket
    app.get('/baskets', basket.findAll);

    // Retrieve a single basket with Id
    app.get('/basket/:id', basket.findOne);

    // Create a new basket
    app.post('/basket',
        // verifyToken,
        [
            check('clientIp').notEmpty().isLength({ min: 9, max: 15 }),
            check('userEmail').optional().isEmail().withMessage('User Email is not valid')
        ],
        basket.create);

    // Update a basket with id
    app.put('/basket/:id',
        // verifyToken, 
        [
            check('clientIp').notEmpty().isLength({ min: 9, max: 15 }),
            check('userEmail').optional().isEmail().withMessage('User Email is not valid')
        ],
        basket.update);

    // Delete a basket with id
    app.delete('/basket/:id',
        // verifyToken,
        basket.delete);

    app.delete('/basket', basket.deleteAll);
}