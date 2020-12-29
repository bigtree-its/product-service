const Address = {
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
    name: String,
    value: [String],
}

const NameValue = {
    name: String,
    value: String,
}



const ReturnPolicy = {

}

module.exports = { Address, Attribute, ReturnPolicy, NameValue }