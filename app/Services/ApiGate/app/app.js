const express = require("express");
const axios = require("axios");
const cors = require("cors");
const authMiddleware = require("./src/middleware/authMiddleware");
const roleMiddleware = require("./src/middleware/roleMiddleware");

const app = express();
const PORT = 4000;

const SERVICES = {
  LOGS: "http://localhost:4001",
  USERS: "http://localhost:4002",
  AUTH: "http://localhost:4003",
  PRODUCTS: "http://localhost:4004",
};

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);
app.use(express.json());

app
  .route("/")
  .get((req, res) => {
    res.status(200).json({ message: "API Gateway is running" });
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
  .route("/login")
  .post(async (req, res) => {
    try {
      const response = await axios.post(SERVICES.AUTH + "/login", req.body);
      axios.post(SERVICES.LOGS + "/logs", {
        level: "info",
        message: `User logged in: ${req.body.username}`,
        source: "API_GATEWAY",
      });
      return res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        axios.post(SERVICES.LOGS + "/logs", {
          level: "warn",
          message: `Login failed for user: ${req.body.username}`,
          source: "API_GATEWAY",
        });
        return res.status(error.response.status).json(error.response.data);
      } else {
        axios.post(SERVICES.LOGS + "/logs", {
          level: "error",
          message: `Internal server error during login for user: ${req.body.username}`,
          source: "API_GATEWAY",
        });
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  })
  .options((req, res) => {
    res.set("Allow", "POST, OPTIONS");
    res.sendStatus(204);
  })
  .all((req, res) => {
    res.set("Allow", "POST, OPTIONS");
    return res.status(405).json({ message: `Method Not Allowed` });
  });

app.use(authMiddleware);
// this is for testing auth middleware
app.get("/authenticated", (req, res) => {
  res.status(200).json({ message: "Authenticated", user: req.user });
});
// Protected routes below
app.route("/verify").get((req, res) => {
  res.status(200).json({ message: "Token is valid", user: req.user });
});

app.use(roleMiddleware(["admin", "user"]));
// this is for testing role middleware
app.get("/authorized", (req, res) => {
  res.status(200).json({ message: "Authorized", user: req.user });
});
// Routes for users below.

app.use(roleMiddleware(["admin"]));
// this is for testing role middleware
app.get("/admin", (req, res) => {
  res.status(200).json({ message: "Admin Access Granted", user: req.user });
});
// Routes for admins below.
app
  .route("/logs")
  .post(async (req, res) => {
    try {
      const response = await axios.post(SERVICES.LOGS + "/logs", req.body);
      return res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  })
  .get(async (req, res) => {
    try {
      const response = await axios.get(SERVICES.LOGS + "/logs", { params: req.query });
      return res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  });

app.listen(PORT, async () => {
  console.log(`API Gateway is running at http://localhost:${PORT}`);
  try {
    axios.post(SERVICES.LOGS + "/logs", {
      level: "info",
      message: `API Gateway started on port ${PORT}`,
      source: "API_GATEWAY",
    });
  } catch (error) {
    console.error("Failed to log startup message:", error.message);
  }
});
