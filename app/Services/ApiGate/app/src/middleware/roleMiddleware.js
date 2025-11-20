const rolesMiddleware = (allowedRoles) => (req, res, next) => {
  let userRole = req?.user?.role;
  if (!userRole) userRole = req?.internal?.role;
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!userRole) {
    return res.status(401).json({ error: "No user role provided." });
  }

  if (rolesArray.includes(userRole)) {
    next();
  } else {
    return res.status(403).json({
      error: "Forbidden.",
    });
  }
};

module.exports = rolesMiddleware;
