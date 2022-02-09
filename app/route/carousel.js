module.exports = (app) => {
    const collection = require('../controller/carousel');
    const { verifyToken } = require('../security/security');
    const { check } = require('express-validator');

    const path = process.env.CONTEXT_PATH + '/carousels';

    // Retrieve all carousel
    app.get(path, collection.findAll);

    // Retrieve a single carousel with Id
    app.get(path + '/:id', collection.findOne);

    // Create a new carousel
    app.post(path,
        // verifyToken, 
        [
            check('product').exists().isUUID().withMessage('Product is not valid'),
            check('title').notEmpty().isLength({ min: 2, max: 20 }),
            check('active').notEmpty().isBoolean().withMessage('Active field not valid'),
            check('coming').notEmpty().isBoolean().withMessage('Coming field not valid')
        ],
        collection.create);

    // Update a carousel with id
    app.put(path + '/:id',
        // verifyToken, 
        [
            check('product').exists().isMongoId().withMessage('Product is not valid')
        ],
        collection.update);

    // Delete a carousel with id
    app.delete(path + '/:id',
        // verifyToken,
        collection.delete);
    //Delete All 
    app.delete(path, collection.deleteEverything);
}