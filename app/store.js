const Data = (req, res) => {
    res.send(
        {
            products: [
                {
                    _id: 1,
                    image: "/icons/apple.png",
                    name: "Jazz Apple",
                    price: "£1.5",
                    brand: "Jazz",
                    rating: 4,
                    reviews: "40"
                },
                {
                    _id: 2,
                    image: "/icons/orange.png",
                    name: "Easy Peel Oranges",
                    price: "£1.5",
                    brand: "Morocco",
                    rating: 4,
                    reviews: "40"
                },
                {
                    _id: 3,
                    image: "/icons/bananas.png",
                    name: "Bananas",
                    price: "£1.5",
                    brand: "Morocco",
                    rating: 4,
                    reviews: "20"
                },
                {
                    _id: 4,
                    image: "/icons/vegetable.png",
                    name: "Vegetables",
                    price: "£1.5",
                    brand: "Morocco",
                    rating: 4,
                    reviews: "400"
                },
                {
                    _id: 5,
                    image: "/icons/tomato.png",
                    name: "Tomato",
                    price: "£1.5",
                    brand: "Morocco",
                    rating: 4,
                    reviews: "140"
                }
            ]
        }
    );
}
module.exports = Data;