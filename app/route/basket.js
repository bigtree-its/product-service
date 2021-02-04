module.exports = (app) => {
    const basket = require('../controller/basket');
    const { verifyToken } = require('../security/security');
    const { check } = require('express-validator');

    const path = process.env.CONTEXT_PATH + '/baskets';

    // Retrieve all basket
    app.get(path, basket.findAll);

    // Retrieve a single basket with Id
    app.get(path + '/:id', basket.findOne);

    // Create a new basket
    app.post(path,
        // verifyToken,
        [
            check('clientIp').notEmpty().isLength({ min: 9, max: 15 }),
            check('userEmail').optional().isEmail().withMessage('User Email is not valid')
        ],
        basket.create);

    // Update a basket with id
    app.put(path + '/:id',
        // verifyToken, 
        [
            check('clientIp').notEmpty().isLength({ min: 9, max: 15 }),
            check('userEmail').optional().isEmail().withMessage('User Email is not valid')
        ],
        basket.update);

    // Delete a basket with id
    app.delete(path + '/:id',
        // verifyToken,
        basket.delete);

    app.delete('/basket', basket.deleteAll);
}