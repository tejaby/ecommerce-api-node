export const listProducts = (req, res) => {
  res.status(200).json({ message: "list products" });
};

export const getProduct = (req, res) => {
  const { id } = req.params;
  res.status(200).json({ message: `get product ${id}` });
};

export const createproduct = (req, res) => {
  const data = req.body;
  res.status(200).json({ message: `create product ${data.product}` });
};

export const updateProduct = (req, res) => {
  const { id } = req.params;
  const data = req.body;
  res.status(200).json({ message: `update product ${id} ${data.product}` });
};

export const deleteProduct = (req, res) => {
  const { id } = req.params;
  res.status(200).json({ message: `delete product ${id}` });
};
