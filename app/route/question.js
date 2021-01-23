module.exports = (app) => {
    const questions = require('../controller/question.js');
    const { verifyToken } = require('../security/security');
    const { check } = require('express-validator');

    // Public routes
    // Retrieve all Quesstions
    app.get('/questions', questions.findAll);

    // Retrieve a single Question with Id
    app.get('/questions/:id', questions.findOne);

    // Private routes
    // Creates a new Question
    app.post('/questions',
        // verifyToken, 
        [
            check('product').exists().isMongoId().withMessage('Product is not valid')
        ],
        questions.create);

    // Update a Question with id
    app.put('/questions/:id', questions.update);

    // Delete a Question with id
    app.delete('/questions/:id', questions.delete);

    // Delete All -- only for non production and can only be done by an admin
    app.delete('/questions', questions.deleteAll);
}