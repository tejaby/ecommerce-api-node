export const listCategories = (req, res) => {
  res.json({ message: "list categories" });
};

export const getCategory = (req, res) => {
  const { id } = req.params;

  res.json({ message: `get category ${id}` });
};

export const createCategory = (req, res) => {
  const data = req.body;
  res.json({ message: `create category ${data.category}` });
};

export const updateCategory = (req, res) => {
  const { id } = req.params;
  const data = req.body;
  res.json({ message: `update category ${id} ${data.category}` });
};

export const deleteCategory = (req, res) => {
  const { id } = req.params;
  res.json({ message: `delete category ${id}` });
};
