const axios = require("axios");

const AUTH_SERVICE_URL = require("../config").SERVICES.AUTH;

const client = axios.create({
  baseURL: AUTH_SERVICE_URL,
  timeout: 5000,
});

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "No authorization header provided." });
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "Invalid authorization format." });
  }

  try {
    const response = await client.post("/verify", { token });

    const userData = response.data;

    req.user = {
      id: userData.userId,
      role: userData.role,
      username: userData.username,
      email: userData.email,
      created_at: userData.created_at,
    };

    req.headers["x-user-id"] = userData.userId;
    req.headers["x-user-role"] = userData.role;
    req.headers["x-user-username"] = userData.username;
    req.headers["x-user-email"] = userData.email;
    req.headers["x-user-created-at"] = userData.created_at;

    return next();
  } catch (error) {
    console.error("Authentication failed:", error?.response?.data || error.message);
    return res.status(401).json({ error: "Unauthorized." });
  }
};

module.exports = authMiddleware;
