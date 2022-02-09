module.exports = (app) => {
    const collection = require('../controller/product.js');
    const { verifyToken } = require('../security/security');
    const { check } = require('express-validator');

    const path = process.env.CONTEXT_PATH + '/products';

    // Public routes
    // Retrieve all Product
    app.get(path, collection.findAll);

    // Retrieve featured Product
    app.get(path + '/featured', collection.featured);

    // Retrieve all Product
    app.get(path + '/paginate', collection.paginate);

    // Retrieve a single Product with Id
    app.get(path + '/:id', collection.findOne);

    // Private routes
    // Creates a new Product
    app.post(path,
        // verifyToken, 
        [
            check('name').notEmpty().isLength({ min: 3, max: 250 }),
            check('brand').exists().isUUID().withMessage('BrandId is not valid UUID'),
            check('categories').exists().isUUID().withMessage('CategoryId is not valid UUID')
        ],

        collection.create);

    // Update a Product with id
    app.put(path + '/:id', collection.update);

    // Delete a Product with id
    app.delete(path + '/:id', collection.delete);

    //Delete All -- only for non production and can only be done by an admin
    app.delete(path, collection.deleteEverything);
}