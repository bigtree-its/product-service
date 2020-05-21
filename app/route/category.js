module.exports = (app) => {
    const categories = require('../controller/category');

    // Create a new brand
    app.post('/categories', categories.create);

    // Retrieve all brand
    app.get('/categories', categories.findAll);

    // Retrieve a single brand with Id
    app.get('/categories/:id', categories.findOne);

    // Update a brand with id
    app.put('/categories/:id', categories.update);

    // Delete a brand with id
    app.delete('/categories/:id', categories.delete);
}