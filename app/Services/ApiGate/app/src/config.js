module.exports = {
  API_GATE_PORT: process.env.API_GATE_PORT || 4000,
  SERVICES: {
    LOGS: process.env.LOGS_SERVICE_URL || "http://localhost:4001",
    AUTH: process.env.AUTH_SERVICE_URL || "http://localhost:4002",
    PRODUCTS: process.env.PRODUCTS_SERVICE_URL || "http://localhost:4003",
  },
};
