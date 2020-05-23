module.exports = (app) => {
    const categories = require('../controller/category');

    // Create a new Category
    app.post('/categories', categories.create);

    // Search all categories
    app.get('/categories/search', categories.search);

    // Retrieve all categories
    app.get('/categories', categories.findAll);

    // Retrieve a single category with Id
    app.get('/categories/:id', categories.findOne);

    // Update a category with id
    app.put('/categories/:id', categories.update);

    // Delete a category with id
    app.delete('/categories/:id', categories.delete);
}