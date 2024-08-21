export const login = (req, res) => {
  const data = req.body;
  res.status(200).json({ message: `login ${data.username}` });
};

export const register = (req, res) => {
  const data = req.body;
  res.status(200).json({ message: `register ${data.username}` });
};

export const logout = (req, res) => {
  res.status(200).json({ message: "logout" });
};

export const refreshToken = (req, res) => {
  res.status(200).json({ message: "refresh token" });
};
