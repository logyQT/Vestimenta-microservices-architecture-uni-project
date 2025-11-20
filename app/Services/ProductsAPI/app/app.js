const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 4003;
const app = express();

let products = [
  { id: 1, name: "Product A", price: 100 },
  { id: 2, name: "Product B", price: 150 },
  { id: 3, name: "Product C", price: 200 },
  { id: 4, name: "Product D", price: 250 },
];

app.use(cors());
app.use(express.json());

app
  .route("/")
  .get((req, res) => {
    res.status(200).json({ message: "Products API is running" });
  })
  .options((req, res) => {
    res.set("Allow", "GET, OPTIONS");
    res.sendStatus(204);
  })
  .all((req, res) => {
    res.set("Allow", "GET, OPTIONS");
    return res.status(405).json({ message: `Method Not Allowed` });
  });

app
  .route("/products")
  .get((req, res) => {
    res.status(200).json(products);
  })
  .post((req, res) => {
    const { name, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required." });
    }
    const newProduct = {
      id: products.length + 1,
      name,
      price,
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  })
  .patch((req, res) => {
    const { id, name, price } = req.body;
    const product = products.find((p) => p.id === id);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }
    if (name) product.name = name;
    if (price) product.price = price;
    res.status(200).json(product);
  })
  .put((req, res) => {
    const { id, name, price } = req.body;
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found." });
    }
    products[productIndex] = { id, name, price };
    res.status(200).json(products[productIndex]);
  })
  .options((req, res) => {
    res.set("Allow", "GET, OPTIONS, POST, PATCH, PUT");
    res.sendStatus(204);
  })
  .all((req, res) => {
    res.set("Allow", "GET, OPTIONS, POST, PATCH, PUT");
    return res.status(405).json({ message: `Method Not Allowed` });
  });

app.listen(PORT, () => {
  console.log(`Products API is running at http://localhost:${PORT}`);
});
