const db = require("./database");
const UserModel = require("./user.model");

const schemaQuery = `
  DROP TABLE IF EXISTS users;

  CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'user',
      password TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      last_modified TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP WITH TIME ZONE
  );
`;

const usersToSeed = [
  {
    username: "admin",
    email: "admin@example.com",
    role: "admin",
    password: "adminpass",
  },
  {
    username: "user",
    email: "user@example.com",
    role: "user",
    password: "userpass",
  },
];

async function runSeed() {
  console.log("🌱 Seeding database...");

  try {
    await db.query(schemaQuery);
    console.log("   - Reset 'users' table structure");

    for (const user of usersToSeed) {
      const createdUser = await UserModel.create(user);
      console.log(`   - Created user: ${createdUser.username} (${createdUser.role})`);
    }

    console.log("✅ Database seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    db.close();
  }
}

runSeed();
