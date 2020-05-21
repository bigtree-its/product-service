module.exports = (app) => {
    const products = require('../controller/product.js');

    // Create a new Product
    app.post('/products', products.create);

    // Retrieve all Product
    app.get('/products', products.findAll);

    // Retrieve a single Product with Id
    app.get('/products/:id', products.findById);

    // Update a Product with id
    app.put('/products/:id', products.update);

    // Delete a Product with id
    app.delete('/products/:id', products.delete);
}