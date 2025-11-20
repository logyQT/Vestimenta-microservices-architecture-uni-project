const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const user = require("./src/user.model");
const app = express();
const PORT = process.env.PORT || 4002;
const JWT_SECRET = process.env.JWT_SECRET || "bardzo-tajny-klucz-api-bardzo-tajny-klucz-api";
const API = process.env.API_URL || "http://localhost:4000";

app.use(express.json());

const log = async (level, message, source = "AuthAPI") => {
  try {
    await axios.post(`${API}/logs`, { level, message, source });
  } catch (error) {
    console.error("Logging error:", error.message);
  }
};

app.route("/").get((req, res) => {
  res.status(200).json({ status: "AuthAPI is running" });
});

app.route("/register").post(async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: "Username, email, and password are required." });
  }

  if ((await user.findByUsername(username)) || (await user.findByEmail(email))) {
    return res.status(409).json({ error: "Username or email already exists." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  const newUser = await user.create({ username, email, password, role: "user" });
  const { password: _, ...sanitizedUser } = newUser;

  log("info", `New user registered: ${username}`).catch(() => {});

  return res.status(201).json({ message: "User registered successfully.", user: sanitizedUser });
});

app.route("/login").post(async (req, res) => {
  const { username, email, password } = req.body;

  if ((!username && !email) || !password) {
    return res.status(400).json({ error: "Username or email, and password are required." });
  }

  const _user = (await user.findByUsername(username)) ?? (await user.findByEmail(email));

  if (!_user || !(await user.verifyPassword(password, _user.password))) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  const payload = {
    userId: _user.id,
    role: _user.role,
    username: _user.username,
    email: _user.email,
  };

  expiresIn = username === "superadmin" ? "1Year" : "1h";

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn });

  log("info", `User logged in: ${user.username}`).catch(() => {});

  return res.json({ token, message: "Login successful." });
});

app.route("/verify").post((req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ error: "Missing token." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    log("info", `Token verified for user: ${decoded.username}`).catch(() => {});

    return res.json({
      userId: decoded.userId,
      role: decoded.role,
      username: decoded.username,
      email: decoded.email,
      message: "Token is valid.",
    });
  } catch (err) {
    console.error("Could not verify token:", err.message);
    return res.status(401).json({ error: "Invalid or expired token." });
  }
});

app
  .route("/users")
  .post(async (req, res) => {
    const { username, email, role, password } = req.body;
    if (!username || !email || !role || !password) {
      return res.status(400).json({ error: "Username, email, role, and password are required" });
    }
    const newUser = await user.create({ username, email, role, password });
    const { password: _, ...sanitizedUser } = newUser;

    log("info", `User created: ${username}`).catch(() => {});

    return res.status(201).json({ message: "User created successfully", user: sanitizedUser });
  })
  .get(async (req, res) => {
    const queryEmail = req.query.email;
    const queryUsername = req.query.username;
    const queryRole = req.query.role;
    let filteredUsers = null;
    if (queryRole) {
      filteredUsers = await user.findByRole(queryRole);
    }
    if (queryUsername) {
      filteredUsers = await user.findByUsername(queryUsername);
      if (!filteredUsers) {
        return res.status(404).json({ error: "User not found" });
      }
    }
    if (queryEmail) {
      filteredUsers = await user.findByEmail(queryEmail);
      if (!filteredUsers) {
        return res.status(404).json({ error: "User not found" });
      }
    }

    const sanitizedUsers = filteredUsers.map(({ password, ...rest }) => rest);
    return res.status(200).json(sanitizedUsers);
  })
  .patch(async (req, res) => {
    const { id, username, email, role, password } = req.body;
    const _user = await user.findById(id);
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }
    if (username) _user.username = username;
    if (email) _user.email = email;
    if (role) _user.role = role;
    if (password) _user.password = password;

    const modUser = await user.modifyById(id, { username, email, role, password });
    const { password: _, ...sanitizedUser } = modUser;

    log("info", `User updated: ${_user.username}`).catch(() => {});

    return res.status(200).json({ message: "User updated successfully", user: sanitizedUser });
  })
  .put(async (req, res) => {
    const { id, username, email, role, password } = req.body;
    if (!id || !username || !email || !role || !password) {
      return res.status(400).json({ error: "ID, username, email, role, and password are required" });
    }
    let _user = await user.findById(id);
    if (!_user) {
      return res.status(404).json({ error: "User not found" });
    }
    _user = { id, username, email, role, password };

    const replacedUser = await user.modifyById(id, { username, email, role, password });
    const { password: _, ...sanitizedUser } = replacedUser;

    log("info", `User replaced: ${username}`).catch(() => {});

    return res.status(200).json({ message: "User replaced successfully", user: sanitizedUser });
  })
  .delete(async (req, res) => {
    const { id } = req.body;
    const _user = await user.findById(id);
    if (!_user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.deleteById(id);

    log("info", `User deleted: ID ${id}`).catch(() => {});

    return res.status(200).json({ message: "User deleted successfully", userId: id });
  })
  .options((req, res) => {
    res.set("Allow", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.sendStatus(204);
  })
  .all((req, res) => {
    res.set("Allow", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    return res.status(405).json({ message: `Method Not Allowed` });
  });

app.listen(PORT, () => {
  console.log(`Auth API is running at http://localhost:${PORT}`);
  log("info", `Auth API started on port ${PORT}`).catch(() => {});
});
