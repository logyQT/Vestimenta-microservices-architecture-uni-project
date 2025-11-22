const db = require("./database");
const ProductModel = require("./product.model");

const products = [
  {
    name: "Silk Evening Dress",
    description: "A stunning floor-length evening dress crafted from pure silk. Features a delicate drape and a flattering silhouette perfect for formal occasions.",
    category: "For Her",
    price: 899,
    image: "https://images.unsplash.com/photo-1678723357379-d87f2a0ec8ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1083", "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=1083"],
    isNew: true,
    sizes: ["XS", "S", "M", "L"],
  },
  {
    name: "Designer Wool Coat",
    description: "Expertly tailored from premium wool blend. This coat combines warmth with timeless elegance, featuring a structured collar and gold-tone buttons.",
    category: "For Her",
    price: 1299,
    image: "https://images.unsplash.com/photo-1762605135012-56a59a059e60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    isNew: false,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    name: "Premium Blazer",
    description: "A sharp, modern blazer for the contemporary gentleman. Italian cut, breathable fabric, and impeccable stitching details.",
    category: "For Him",
    price: 799,
    image: "https://images.unsplash.com/photo-1515736076039-a3ca66043b27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    isNew: false,
    sizes: ["48", "50", "52", "54"],
  },
  {
    name: "Luxury Heels",
    description: "Handcrafted Italian leather heels. Designed for both comfort and style, these stilettos add a touch of glamour to any outfit.",
    category: "Accessories",
    price: 549,
    image: "https://images.unsplash.com/photo-1760331339913-da9637154477?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    isNew: true,
    sizes: ["36", "37", "38", "39", "40"],
  },
  {
    name: "Leather Handbag",
    description: "Genuine full-grain leather handbag with gold hardware accents. Spacious interior with multiple compartments for organization.",
    category: "Accessories",
    price: 1199,
    image: "https://images.unsplash.com/photo-1682317056294-1970c953cfd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    isNew: false,
    sizes: ["One Size"],
  },
  {
    name: "Gold Necklace",
    description: "18k Gold plated statement necklace. A bold piece that elevates even the simplest attire.",
    category: "Accessories",
    price: 2499,
    image: "https://images.unsplash.com/photo-1762505464426-7467c051ea76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    isNew: true,
    sizes: ["One Size"],
  },
  {
    name: "Silk Scarf",
    description: "100% Mulberry silk scarf featuring a custom Vestimenta print. Soft, lightweight, and versatile.",
    category: "Accessories",
    price: 349,
    image: "https://images.unsplash.com/photo-1761660450845-6c3aa8aaf43f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    isNew: false,
    sizes: ["One Size"],
  },
  {
    name: "Designer Belt",
    description: "Reversible leather belt with the iconic V-buckle in brushed gold. A wardrobe staple.",
    category: "Accessories",
    price: 299,
    image: "https://images.unsplash.com/photo-1664286074240-d7059e004dff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    isNew: false,
    sizes: ["85", "90", "95", "100"],
  },
];

const schemaQuery = `
  DROP TABLE IF EXISTS products;

  CREATE TABLE products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(100),
      price NUMERIC(10, 2) NOT NULL,
      image TEXT,
      images JSONB DEFAULT '[]',
      is_new BOOLEAN DEFAULT false,
      sizes JSONB DEFAULT '[]', 
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
`;

async function runSeed() {
  console.log("🌱 Seeding Products Database...");

  try {
    await db.query(schemaQuery);
    console.log("  - 'products' table created successfully");

    for (const product of products) {
      const createdProduct = await ProductModel.create(product);
      console.log(`    ✓ Created: [${createdProduct.id}] ${createdProduct.name}`);
    }

    console.log("✅ Database seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    db.close();
  }
}

runSeed();
