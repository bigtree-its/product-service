module.exports = (app) => {
    const products = require('../controller/product.js');
    const { verifyToken } = require('../security/security')

    // Public routes
    // Retrieve all Product
    app.get('/products', products.findAll);

    // Retrieve all Product
    app.get('/products/paginate', products.paginate);

    // Retrieve a single Product with Id
    app.get('/products/:id', products.findOne);

    // Private routes
    // Create a new Product
    app.post('/products', verifyToken, products.create);

    // Update a Product with id
    app.put('/products/:id', verifyToken, products.update);

    // Delete a Product with id
    app.delete('/products/:id', verifyToken, products.delete);
}