const SERVICES = require("./src/config").SERVICES;
const PORT = require("./src/config").API_GATE_PORT;

const express = require("express");
const axios = require("axios");
const cors = require("cors");
const authMiddleware = require("./src/middleware/authMiddleware");
const roleMiddleware = require("./src/middleware/roleMiddleware");
const loggerMiddleware = require("./src/middleware/loggerMiddleware");
const app = express();

const LOGS = axios.create({
  baseURL: SERVICES.LOGS,
  timeout: 5000,
});
const AUTH = axios.create({
  baseURL: SERVICES.AUTH,
  timeout: 5000,
});
const PRODUCTS = axios.create({
  baseURL: SERVICES.PRODUCTS,
  timeout: 5000,
});

app.use(cors());

app.use(express.json());

app.use(loggerMiddleware);

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
      const response = await AUTH.post("/login", req.body);

      return res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      } else {
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

app
  .route("/register")
  .post(async (req, res) => {
    try {
      const response = await AUTH.post("/register", req.body);
      return res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      } else {
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

app.get("/products", async (req, res) => {
  try {
    const response = await PRODUCTS.get("/products", { params: req.query });
    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    } else {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.use(authMiddleware);
// ! Routes that require authentication below.
app
  .route("/verify")
  .get((req, res) => {
    res.status(200).json({ message: "Token is valid", user: req.user });
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
  .route("/me")
  .get(async (req, res) => {
    try {
      const response = await AUTH.get("/me", { headers: { "x-user-id": req.user.id } });
      return res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  })
  .patch(async (req, res) => {
    try {
      const response = await AUTH.patch("/me", req.body, { headers: { "x-user-id": req.user.id } });
      return res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  })
  .put(async (req, res) => {
    try {
      const response = await AUTH.put("/me", req.body, { headers: { "x-user-id": req.user.id } });
      return res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  })
  .delete(async (req, res) => {
    try {
      const response = await AUTH.delete("/me", { data: req.body, headers: { "x-user-id": req.user.id } });
      return res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  })
  .options((req, res) => {
    res.set("Allow", "GET, PATCH, DELETE, OPTIONS");
    res.sendStatus(204);
  })
  .all((req, res) => {
    res.set("Allow", "GET, PATCH, DELETE, OPTIONS");
    return res.status(405).json({ message: `Method Not Allowed` });
  });

app.use(roleMiddleware(["admin", "user"]));
// ! Routes for users below.

app.use(roleMiddleware(["admin"]));
// ! Routes for admins below.
app.route("/logs").get(async (req, res) => {
  try {
    const response = await LOGS.get("/logs", { params: req.query });
    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    } else {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.route("/health").get(async (req, res) => {
  let healthyServices = [];
  let unhealthyServices = [];
  for (const [serviceName, serviceUrl] of Object.entries(SERVICES)) {
    try {
      const response = await axios.get(serviceUrl + "/health");
      if (response.status === 200) {
        healthyServices.push(serviceName);
      } else {
        unhealthyServices.push(serviceName);
      }
    } catch (error) {
      unhealthyServices.push({ service: serviceName, error: error.message });
    }
  }
  if (unhealthyServices.length === 0) {
    return res.status(200).json({ message: `${healthyServices.length}/${Object.keys(SERVICES).length} All Services Operational` });
  } else {
    return res.status(500).json({ message: `${unhealthyServices.length}/${Object.keys(SERVICES).length} Services Unhealthy`, unhealthyServices });
  }
});

app
  .route("/users")
  .get(async (req, res) => {
    try {
      const response = await AUTH.get("/users", { params: req.query });
      return res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  })
  .post(async (req, res) => {
    try {
      const response = await AUTH.post("/users", req.body);
      return res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  })
  .put(async (req, res) => {
    try {
      const response = await AUTH.put("/users", req.body);
      return res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  })
  .patch(async (req, res) => {
    try {
      const response = await AUTH.patch("/users", req.body);
      return res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  })
  .delete(async (req, res) => {
    try {
      const response = await AUTH.delete("/users", { data: req.body });
      return res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  })
  .all((req, res) => {
    res.set("Allow", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    return res.status(405).json({ message: `Method Not Allowed` });
  });

app
  .route("/products")
  .post(async (req, res) => {
    try {
      const response = await PRODUCTS.post("/products", req.body);
      return res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  })
  .patch(async (req, res) => {
    try {
      const response = await PRODUCTS.patch("/products", req.body);
      return res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  })
  .put(async (req, res) => {
    try {
      const response = await PRODUCTS.put("/products", req.body);
      return res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  })
  .delete(async (req, res) => {
    try {
      const response = await PRODUCTS.delete("/products", { data: req.body });
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
});
