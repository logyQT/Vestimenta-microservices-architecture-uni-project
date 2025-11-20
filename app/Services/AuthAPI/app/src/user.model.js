const db = require("./database");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

const UserModel = {
  create: async ({ username, email, password, role = "user" }) => {
    if (username.includes("'") || email.includes("'")) {
      throw new Error("Invalid characters in username or email");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const query = `
      INSERT INTO users (username, email, role, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, email, role, created_at;
    `;

    const { rows } = await db.query(query, [username, email, role, hashedPassword]);
    return rows[0];
  },

  deleteById: async (id) => {
    const query = `DELETE FROM users WHERE id = $1 RETURNING id;`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  },

  modifyById: async (id, { username, email, role, password, last_login }) => {
    const fields = [];
    const values = [];
    let index = 1;
    if (username) {
      fields.push(`username = $${index++}`);
      values.push(username);
    }
    if (email) {
      fields.push(`email = $${index++}`);
      values.push(email);
    }
    if (role) {
      fields.push(`role = $${index++}`);
      values.push(role);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      fields.push(`password = $${index++}`);
      values.push(hashedPassword);
    }
    if (last_login) {
      fields.push(`last_login = $${index++}`);
      values.push(last_login);
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    const modifyTimestamp = new Date().toISOString();
    fields.push(`last_modified = $${index++}`);
    values.push(modifyTimestamp);

    const query = `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING id, username, email, role, created_at, last_modified, last_login;
    `;

    values.push(id);

    const { rows } = await db.query(query, values);
    return rows[0];
  },

  findByRole: async (role) => {
    const query = `SELECT * FROM users WHERE role = $1`;
    const { rows } = await db.query(query, [role]);
    return rows;
  },

  findByUsername: async (username) => {
    const query = `SELECT * FROM users WHERE username = $1`;
    const { rows } = await db.query(query, [username]);
    return rows[0];
  },

  findById: async (id) => {
    const query = `SELECT * FROM users WHERE id = $1`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  },

  findByEmail: async (email) => {
    const query = `SELECT * FROM users WHERE email = $1`;
    const { rows } = await db.query(query, [email]);
    return rows[0];
  },

  findAll: async () => {
    const query = `SELECT * FROM users`;
    const { rows } = await db.query(query);
    return rows;
  },

  verifyPassword: async (plainTextPassword, hash) => {
    return await bcrypt.compare(plainTextPassword, hash);
  },
};

module.exports = UserModel;
