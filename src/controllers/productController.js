import sequelize from "../db.js";

export const listProducts = async (req, res) => {
  try {
    const result = await sequelize.query(`EXEC psp_list_products`, {
      type: sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ error: "se produjo un error" });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sequelize.query(
      `EXEC psp_get_products @product_id = :id`,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
          id,
        },
      }
    );

    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ error: "se produjo un error" });
  }
};

export const createproduct = async (req, res) => {
  const {
    name,
    description,
    brand,
    price,
    stock,
    image,
    user_id,
    category_id,
  } = req.body;

  if (
    !name ||
    !description ||
    !brand ||
    !price ||
    !stock ||
    !image ||
    !user_id ||
    !category_id
  ) {
    res.status(400).json({ error: "faltan campos obligatorios" });
    return;
  }

  try {
    const result = await sequelize.query(
      `EXEC psp_ins_products @name = :name, @description = :description, @brand = :brand, @price = :price, @stock = :stock, @image = :image, @user_id = :user_id, @category_id = :category_id`,
      {
        replacements: {
          name,
          description,
          brand,
          price,
          stock,
          image,
          user_id,
          category_id,
        },
        type: sequelize.QueryTypes.RAW,
      }
    );

    res.status(200).json({ message: `create product` });
  } catch (err) {
    res.status(500).json({ error: "se produjo un error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: "faltan campos obligatorios" });
  }
  const { name, description, brand, price, stock, image } = req.body;

  try {
    const result = await sequelize.query(
      `EXEC psp_upd_products @product_id = :id, @name = :name, @description = :description, @brand = :brand, @price = :price, @stock = :stock, @image = :image`,
      {
        replacements: {
          id,
          name,
          description,
          brand,
          price,
          stock,
          image,
        },
        type: sequelize.QueryTypes.RAW,
      }
    );

    res.status(200).json({ message: `update product` });
  } catch (err) {
    res.status(500).json({ error: "se produjo un error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: "faltan campos obligatorios" });
  }

  try {
    const result = await sequelize.query(
      `EXEC psp_del_products @product_id = :id`,
      {
        replacements: {
          id,
        },
        type: sequelize.QueryTypes.RAW,
      }
    );

    res.status(200).json({ message: `delete product` });
  } catch (err) {
    res.status(500).json({ error: "se produjo un error" });
  }
};
