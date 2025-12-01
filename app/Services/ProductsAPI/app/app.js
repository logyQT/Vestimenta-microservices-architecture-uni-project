const express = require("express");
const PORT = process.env.PORT || 4003;
const app = express();
const product = require("./src/product.model");

app.use(express.json());

app.route("/health").get((req, res) => {
  res.status(200).json({ status: "ProductsAPI is healthy" });
});

app
  .route("/products")
  .get(async (req, res) => {
    const { id } = req.query;
    if (id) {
      const prod = await product.getById(id);
      return res.status(200).json(prod);
    }
    const products = await product.getAll();
    return res.status(200).json(products);
  })
  .post(async (req, res) => {
    console.log("Creating product with data:", req.body);
    const { name, description, category, price, image, images, isNew, sizes } = req.body;
    if (!name || !price || !description || !category || !image || !sizes || !isNew) {
      console.error("Missing required fields for product creation.");
      return res.status(400).json({ error: "Name and price are required." });
    }
    const newProduct = await product.create({
      name,
      description,
      category,
      price,
      image,
      images,
      isNew,
      sizes,
    });

    res.status(201).json(newProduct);
  })
  .patch(async (req, res) => {
    const { id, name, description, category, price, image, images, isNew, sizes } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Product ID is required for update." });
    }
    const _product = await product.getById(id);
    if (!_product) {
      return res.status(404).json({ error: "Product not found." });
    }
    if (name) _product.name = name;
    if (description) _product.description = description;
    if (category) _product.category = category;
    if (image) _product.image = image;
    if (images) _product.images = images;
    if (isNew !== undefined) _product.isNew = isNew;
    if (price) _product.price = price;
    if (sizes) _product.sizes = sizes;

    const updatedProduct = await product.updateById(id, _product);
    res.status(200).json(updatedProduct);
  })
  .put((req, res) => {
    const { id, name, description, category, price, image, images, isNew, sizes } = req.body;
    if (!id || !name || !price || !description || !category || !image || !sizes || isNew === undefined) {
      return res.status(400).json({ error: "All product fields are required for full update." });
    }
    const updatedProduct = product.updateById(id, {
      name,
      description,
      category,
      price,
      image,
      images,
      isNew,
      sizes,
    });
    res.status(200).json(updatedProduct);
  })
  .delete(async (req, res) => {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Product ID is required for deletion." });
    }
    const _product = await product.getById(id);
    if (!_product) {
      return res.status(404).json({ error: "Product not found." });
    }

    await product.deleteById(id);

    return res.status(200).json({ message: "Product deleted successfully", productId: id });
  })
  .options((req, res) => {
    res.set("Allow", "GET, OPTIONS, POST, PATCH, PUT, DELETE");
    res.sendStatus(204);
  })
  .all((req, res) => {
    res.set("Allow", "GET, OPTIONS, POST, PATCH, PUT, DELETE");
    return res.status(405).json({ message: `Method Not Allowed` });
  });

app.listen(PORT, () => {
  console.log(`Products API is running at http://localhost:${PORT}`);
});
