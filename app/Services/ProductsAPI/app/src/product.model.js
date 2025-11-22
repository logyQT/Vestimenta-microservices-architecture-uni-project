const db = require("./database");

const ProductModel = {
  async create(product) {
    const { name, description, category, price, image, images, isNew, sizes } = product;

    const query = `
      INSERT INTO products 
      (name, description, category, price, image, images, is_new, sizes) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *;
    `;

    const values = [name, description, category, price, image, JSON.stringify(images || []), isNew, JSON.stringify(sizes)];

    const { rows } = await db.query(query, values);
    return rows[0];
  },
  async getAll() {
    const query = `SELECT * FROM products ORDER BY id;`;
    const { rows } = await db.query(query);
    return rows;
  },
  async updateById(id, product) {
    const fields = [];
    const values = [];
    let index = 1;
    if (product.name) {
      fields.push(`name = $${index++}`);
      values.push(product.name);
    }
    if (product.description) {
      fields.push(`description = $${index++}`);
      values.push(product.description);
    }
    if (product.category) {
      fields.push(`category = $${index++}`);
      values.push(product.category);
    }
    if (product.price) {
      fields.push(`price = $${index++}`);
      values.push(product.price);
    }
    if (product.image) {
      fields.push(`image = $${index++}`);
      values.push(product.image);
    }
    if (product.images) {
      fields.push(`images = $${index++}`);
      values.push(JSON.stringify(product.images));
    }
    if (product.is_new !== undefined) {
      fields.push(`is_new = $${index++}`);
      values.push(product.is_new);
    }
    if (product.sizes) {
      fields.push(`sizes = $${index++}`);
      values.push(JSON.stringify(product.sizes));
    }

    if (fields.length === 0) {
      return this.getById(id);
    }

    const query = `
      UPDATE products
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING *;
    `;

    values.push(id);

    const { rows } = await db.query(query, values);
    return rows[0];
  },
  async getById(id) {
    const query = `SELECT * FROM products WHERE id = $1;`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  },
};

module.exports = ProductModel;
