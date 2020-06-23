module.exports = (app) => {
    const products = require('../controller/product.js');
    const { verifyToken } = require('../security/security');
    const { check } = require('express-validator');

    // Public routes
    // Retrieve all Product
    app.get('/products', products.findAll);

    // Retrieve all Product
    app.get('/products/paginate', products.paginate);

    // Retrieve a single Product with Id
    app.get('/products/:id', products.findOne);

    // Private routes
    // Creates a new Product
    app.post('/products',
        // verifyToken, 
        [
            check('name').notEmpty().isLength({ min: 3, max: 50 }),
            check('brand').exists().isMongoId().withMessage('BrandId is not valid1'),
            check('categories').exists().isMongoId().withMessage('CategoryId is not valid')
        ],

        products.create);

    // Update a Product with id
    app.put('/products/:id',
        // verifyToken, 

        products.update);

    // Delete a Product with id
    app.delete('/products/:id',
    //  verifyToken,
      products.delete);
}