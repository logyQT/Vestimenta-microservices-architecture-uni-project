const { Pool } = require("pg");

const poolConfig = {
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "products_db",
  password: process.env.DB_PASSWORD || "password",
  port: process.env.DB_PORT || 5432,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close client if idle for 30s
  connectionTimeoutMillis: 2000, // Return an error if connection takes > 2s
};

const pool = new Pool(poolConfig);

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle database client", err);
});

module.exports = {
  query: async (text, params) => {
    const start = performance.now();
    try {
      const res = await pool.query(text, params);
      const duration = performance.now() - start;
      return res;
    } catch (error) {
      console.error("Database Query Error:", { text, error });
      throw error;
    }
  },

  getClient: async () => {
    const client = await pool.connect();
    const query = client.query;
    const release = client.release;

    const timeout = setTimeout(() => {
      console.error("A client has been checked out for more than 5 seconds!");
      console.error("Did you forget to release it?");
    }, 5000);

    client.release = () => {
      clearTimeout(timeout);
      client.query = query;
      client.release = release;
      return release.apply(client);
    };

    return client;
  },

  close: () => {
    return pool.end();
  },
};
