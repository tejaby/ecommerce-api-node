export const listUsers = (req, res) => {
  res.status(200).json({ message: "list users" });
};

export const getUser = (req, res) => {
  const { id } = req.params;
  res.status(200).json({ message: `get user ${id}` });
};

export const createUser = (req, res) => {
  const data = req.body;
  res.status(200).json({ message: `create user ${data.username}` });
};

export const updateUser = (req, res) => {
  const { id } = req.params;
  const data = req.body;
  res.status(200).json({ message: `update user ${id} ${data.username}` });
};

export const deleteUser = (req, res) => {
  const { id } = req.params;
  res.status(200).json({ message: `delete user ${id}` });
};
