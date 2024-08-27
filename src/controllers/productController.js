import sequelize from "../db.js";

export const listProducts = async (req, res) => {
  try {
    const result = await sequelize.query(`EXEC psp_list_products`, {
      type: sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ error: "Se produjo un error" });
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
    res.status(500).json({ error: "Se produjo un error" });
  }
};

export const createproduct = async (req, res) => {
  const { user_id } = req.user;

  const {
    name,
    description = null,
    brand = null,
    price,
    stock,
    image = null,
    category_id,
  } = req.body;

  if (!name || !price || !stock || !category_id) {
    res.status(400).json({ error: "Faltan campos obligatorios" });
    return;
  }

  try {
    const [product] = await sequelize.query(
      `SELECT * FROM products WHERE name = :name`,
      {
        replacements: {
          name,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (product) {
      res.status(400).json({ error: "El producto ya existe" });
      return;
    }

    const [category] = await sequelize.query(
      `SELECT * FROM categories WHERE category_id = :category_id`,
      {
        replacements: {
          category_id,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!category) {
      res.status(400).json({ error: "La categoría no existe" });
      return;
    }

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

    res.status(200).json({ message: `Producto creado exitosamente` });
  } catch (err) {
    res.status(500).json({ error: "Se produjo un error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;

  const {
    name = null,
    description = null,
    brand = null,
    price = null,
    stock = null,
    image = null,
  } = req.body;

  try {
    const [product] = await sequelize.query(
      `SELECT * FROM products WHERE name = :name`,
      {
        replacements: {
          name,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (product) {
      res.status(400).json({ error: "El producto ya existe" });
      return;
    }

    const [getProduct] = await sequelize.query(
      `SELECT * FROM products WHERE product_id = :id`,
      {
        replacements: {
          id,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!getProduct) {
      res.status(404).json({ error: "El producto no existe" });
      return;
    }

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

    res.status(200).json({ message: `Producto actualizado exitosamente` });
  } catch (err) {
    res.status(500).json({ error: "Se produjo un error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const [product] = await sequelize.query(
      `SELECT * FROM products WHERE product_id =:id`,
      { replacements: { id }, type: sequelize.QueryTypes.SELECT }
    );

    if (!product) {
      res.status(404).json({ error: "El producto no existe" });
      return;
    }

    const result = await sequelize.query(
      `EXEC psp_del_products @product_id = :id`,
      {
        replacements: {
          id,
        },
        type: sequelize.QueryTypes.RAW,
      }
    );

    res.status(200).json({ message: `Producto desactivado exitosamente` });
  } catch (err) {
    res.status(500).json({ error: "Se produjo un error" });
  }
};
