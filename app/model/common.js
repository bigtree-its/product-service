const uuid = require('node-uuid');
const Address = {
    _id: {type: String, default: uuid.v4},
    name: String,
    email: String,
    mobile: String,
    telephone: String,
    address: String,
    city: String,
    postcode: String,
    country: String
}

const Attribute = {
    _id: {type: String, default: uuid.v4},
    name: String,
    value: [String],
}

const NameValue = {
    _id: {type: String, default: uuid.v4},
    name: String,
    value: String,
}



const ReturnPolicy = {

}

module.exports = { Address, Attribute, ReturnPolicy, NameValue }