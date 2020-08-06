module.exports = (app) => {
    const departments = require('../controller/department');
    const { verifyToken } = require('../security/security');
    const { check } = require('express-validator');

    // Retrieve all departments
    app.get('/departments', departments.findAll);

    // Retrieve a single category with Id
    app.get('/departments/:id', departments.findOne);

    // Create a new Category
    app.post('/departments',
        // verifyToken,
        [
            check('name').notEmpty().isLength({ min: 2, max: 30 })
        ],
        departments.create);

    // Update a category with id
    app.put('/departments/:id',
        // verifyToken, 
        [
            check('name').notEmpty().isLength({ min: 2, max: 30 })
        ],
        departments.update);

    // Delete a category with id
    app.delete('/departments/:id',
        // verifyToken,
        departments.delete);

    app.delete('/departments', departments.deleteAll);
}