module.exports = (app) => {
    const brands = require('../controller/brand');

    // Create a new brand
    app.post('/brands', brands.create);

    // Retrieve all brand
    app.get('/brands', brands.findAll);

    // Retrieve a single brand with Id
    app.get('/brands/:id', brands.findOne);

    // Update a brand with id
    app.put('/brands/:id', brands.update);

    // Delete a brand with id
    app.delete('/brands/:id', brands.delete);
}