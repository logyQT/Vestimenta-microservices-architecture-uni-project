const express = require("express");
const jwt = require("jsonwebtoken");
const user = require("./src/user.model");
const app = express();
const PORT = process.env.PORT || 4002;
const JWT_SECRET = process.env.JWT_SECRET || "7df00b92c6e37189eecdba3b3d3260f5";

app.use(express.json());

app.route("/health").get((req, res) => {
  res.status(200).json({ status: "AuthAPI is healthy" });
});

app.route("/register").post(async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: "Username, email, password and confirmPassword are required." });
  }

  if ((await user.findByUsername(username)) || (await user.findByEmail(email))) {
    return res.status(409).json({ error: "Username or email already exists." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  const newUser = await user.create({ username, email, password, role: "user" });
  const { password: _, ...sanitizedUser } = newUser;

  return res.status(201).json({ message: "User registered successfully.", user: sanitizedUser });
});

app.route("/login").post(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const _user = await user.findByEmail(email);

  if (!_user || !(await user.verifyPassword(password, _user.password))) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  await user.modifyById(_user.id, { last_login: new Date().toISOString() });

  const payload = {
    userId: _user.id,
    role: _user.role,
    username: _user.username,
    email: _user.email,
    created_at: _user.created_at,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

  return res.json({ token, message: "Login successful." });
});

app.route("/verify").post((req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ error: "Missing token." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    return res.json({
      userId: decoded.userId,
      role: decoded.role,
      username: decoded.username,
      email: decoded.email,
      created_at: decoded.created_at,
      message: "Token is valid.",
    });
  } catch (err) {
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

    if (await user.findByEmail(email)) {
      return res.status(409).json({ error: "Email already exists." });
    }
    if (await user.findByUsername(username)) {
      return res.status(409).json({ error: "Username already exists." });
    }

    const newUser = await user.create({ username, email, role, password });
    const { password: _, ...sanitizedUser } = newUser;

    return res.status(201).json({ message: "User created successfully", user: sanitizedUser });
  })
  .get(async (req, res) => {
    const queryEmail = req.query.email;
    const queryUsername = req.query.username;
    const queryRole = req.query.role;
    let filteredUsers = await user.findAll();
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
    if (!Array.isArray(filteredUsers)) filteredUsers = [filteredUsers];
    const sanitizedUsers = filteredUsers.map(({ password, ...rest }) => rest);
    return res.status(200).json(sanitizedUsers);
  })
  .patch(async (req, res) => {
    const { id, username, email, role, password } = req.body;
    const _user = await user.findById(id);
    if (!_user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (email && (await user.findByEmail(email)) && _user.email !== email) {
      return res.status(409).json({ error: "Email already exists." });
    }
    if (username && (await user.findByUsername(username)) && _user.username !== username) {
      return res.status(409).json({ error: "Username already exists." });
    }

    if (username) _user.username = username;
    if (email) _user.email = email;
    if (role) _user.role = role;
    if (password) _user.password = password;

    const modUser = await user.modifyById(id, { username, email, role, password });
    const { password: _, ...sanitizedUser } = modUser;

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
    if ((await user.findByEmail(email)) && _user.email !== email) {
      return res.status(409).json({ error: "Email already exists." });
    }
    if ((await user.findByUsername(username)) && _user.username !== username) {
      return res.status(409).json({ error: "Username already exists." });
    }

    _user = { id, username, email, role, password };

    const replacedUser = await user.modifyById(id, { username, email, role, password });
    const { password: _, ...sanitizedUser } = replacedUser;

    return res.status(200).json({ message: "User replaced successfully", user: sanitizedUser });
  })
  .delete(async (req, res) => {
    const { id } = req.body;
    const _user = await user.findById(id);
    if (!_user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.deleteById(id);

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

app
  .route("/me")
  .get(async (req, res) => {
    const currentUserId = req.headers["x-user-id"];
    const currentUser = await user.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }
    const { password, id, role, ...sanitizedUser } = currentUser;
    return res.status(200).json(sanitizedUser);
  })
  .patch(async (req, res) => {
    const currentUserId = req.headers["x-user-id"];
    const { username, email, newPassword, confirmNewPassword, password } = req.body;
    const _user = await user.findById(currentUserId);

    if (!_user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!password) {
      return res.status(400).json({ error: "Current password is required to make changes." });
    }
    if (!(await user.verifyPassword(password, _user.password))) {
      return res.status(400).json({ error: "Password does not match the current password." });
    }
    if (email && (await user.findByEmail(email)) && _user.email !== email) {
      return res.status(409).json({ error: "Email already exists." });
    }
    if (username && (await user.findByUsername(username)) && _user.username !== username) {
      return res.status(409).json({ error: "Username already exists." });
    }
    if (newPassword && newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: "New passwords do not match." });
    }
    if (newPassword && user.verifyPassword(newPassword, _user.password)) {
      return res.status(400).json({ error: "New password must be different from the current password." });
    }

    if (username) _user.username = username;
    if (email) _user.email = email;
    if (newPassword) _user.password = newPassword;

    const modUser = await user.modifyById(currentUserId, { username, email, password });
    const { password: _, id, role, ...sanitizedUser } = modUser;
    return res.status(200).json({ message: "User updated successfully", user: sanitizedUser });
  })
  .delete(async (req, res) => {
    const currentUserId = req.headers["x-user-id"];
    const { password } = req.body;
    const _user = await user.findById(currentUserId);
    if (!_user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!password) {
      return res.status(400).json({ error: "Password is required to delete the account." });
    }
    if (!(await user.verifyPassword(password, _user.password))) {
      return res.status(400).json({ error: "Incorrect password." });
    }
    await user.deleteById(currentUserId);
    return res.status(200).json({ message: "User deleted successfully", userId: currentUserId });
  })
  .options((req, res) => {
    res.set("Allow", "GET, PATCH, DELETE, OPTIONS");
    res.sendStatus(204);
  })
  .all((req, res) => {
    res.set("Allow", "GET, PATCH, DELETE, OPTIONS");
    return res.status(405).json({ message: `Method Not Allowed` });
  });

app.listen(PORT, () => {
  console.log(`Auth API is running at http://localhost:${PORT}`);
});
