const { Query } = require("mongoose")

const A = {
    id: "",
    answer: "",
    date: "",
    userEmail: "",
    userName: "",
}

const Q = {
    id: "",
    question: "",
    answers: [A],
    date: "",
    userEmail: "",
    userName: "",
}

var ProductQA = {product:"", questions:[Q]};

module.exports = { ProductQA, Q, A }