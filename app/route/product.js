module.exports = (app) => {
    const products = require('../controller/product.js');
    const { verifyToken } = require('../security/security');
    const { check } = require('express-validator');

    const path = process.env.CONTEXT_PATH + '/products';

    // Public routes
    // Retrieve all Product
    app.get(path, products.findAll);

    // Retrieve featured Product
    app.get(path + '/featured', products.featured);

    // Retrieve all Product
    app.get(path + '/paginate', products.paginate);

    // Retrieve a single Product with Id
    app.get(path + '/:id', products.findOne);

    // Private routes
    // Creates a new Product
    app.post(path,
        // verifyToken, 
        [
            check('name').notEmpty().isLength({ min: 3, max: 250 }),
            check('brand').exists().isMongoId().withMessage('BrandId is not valid1'),
            check('categories').exists().isMongoId().withMessage('CategoryId is not valid')
        ],

        products.create);

    // Update a Product with id
    app.put(path + '/:id', products.update);

    // Delete a Product with id
    app.delete(path + '/:id', products.delete);

    //Delete All -- only for non production and can only be done by an admin
    app.delete(path, products.deleteEverything);
}