export const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role_id === 1) {
    next();
  } else {
    res.status(403).json({ error: "No tiene permisos" });
  }
};
