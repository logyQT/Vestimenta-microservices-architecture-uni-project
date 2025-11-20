const axios = require("axios");

const LOGS_URL = process.env.SERVICES_LOGS || "http://localhost:4001";

const requestLogger = (req, res, next) => {
  const start = performance.now();

  res.on("finish", async () => {
    const duration = (performance.now() - start).toFixed(2);
    const status = res.statusCode;
    const method = req.method;
    const url = req.originalUrl;
    const user = req.user ? req.user.username : "Guest";

    let level = "info";
    if (status >= 400) level = "warn";
    if (status >= 500) level = "error";

    const message = `${method} ${url} ${status} - ${duration}ms - User: ${user}`;

    try {
      await axios.post(`${LOGS_URL}/logs`, {
        level,
        message,
        source: "API_GATEWAY",
        timestamp: Date.now(),
        metadata: {
          url,
          method,
          status,
          duration,
          user,
          ip: req.ip,
        },
      });
    } catch (err) {
      console.error("[Logger Middleware] Failed to write log:", err.message);
    }
  });

  next();
};

module.exports = requestLogger;
