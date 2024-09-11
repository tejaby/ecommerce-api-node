import sequelize from "../db.js";
import { uploadImage } from "../utils/cloudinary.js";

export const listProducts = async (req, res) => {
  const { category } = req.query;

  try {
    if (!category) {
      const result = await sequelize.query(`EXEC psp_list_products`, {
        type: sequelize.QueryTypes.SELECT,
      });
      res.status(200).json({ data: result });
      return;
    }

    const [categoryResult] = await sequelize.query(
      `EXEC csp_get_category_by_name @name = :category`,
      {
        replacements: {
          category,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!categoryResult) {
      res.status(400).json({ error: "La categoría no existe" });
      return;
    }

    const result = await sequelize.query(
      `EXEC psp_list_products_by_category @category_id = :category`,
      {
        replacements: {
          category: categoryResult.category_id,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ error: "Se produjo un error" });
  }
};

export const listProductsExtended = async (req, res) => {
  try {
    const result = await sequelize.query(
      `EXEC psp_list_products_with_details`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
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
    state_id,
  } = req.body;

  if (!name || !price || !stock || !category_id || !state_id) {
    res.status(400).json({ error: "Faltan campos obligatorios" });
    return;
  }

  try {
    const [product] = await sequelize.query(
      `EXEC csp_get_product_by_name @name = :name`,
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
      `EXEC csp_get_categories @category_id = :category_id`,
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

    let imageUrl = null;

    if (req.files?.image) {
      const result = await uploadImage(req.files.image.tempFilePath);
      imageUrl = result.url;
    }

    const [result] = await sequelize.query(
      `EXEC psp_ins_products @name = :name, @description = :description, @brand = :brand, @price = :price, @stock = :stock, @image = :image, @user_id = :user_id, @category_id = :category_id, @state_id = :state_id`,
      {
        replacements: {
          name,
          description,
          brand,
          price,
          stock,
          image: imageUrl,
          user_id,
          category_id,
          state_id,
        },
        type: sequelize.QueryTypes.RAW,
      }
    );

    res
      .status(200)
      .json({ message: `Producto creado exitosamente`, data: result[0] });
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
      `EXEC csp_get_product_by_name @name = :name`,
      {
        replacements: {
          name,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (product && product.product_id != id) {
      res.status(400).json({ error: "El producto ya existe" });
      return;
    }

    const [getProduct] = await sequelize.query(
      `EXEC psp_get_products @product_id = :id`,
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

    await sequelize.query(
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

export const updateProductState = async (req, res) => {
  const { id } = req.params;

  const { state_id } = req.body;

  if (!state_id) {
    res.status(400).json({ error: "Falta el estado" });
    return;
  }

  try {
    const [product] = await sequelize.query(
      `EXEC psp_get_products @product_id = :id`,
      { replacements: { id }, type: sequelize.QueryTypes.SELECT }
    );

    if (!product) {
      res.status(404).json({ error: "El producto no existe" });
      return;
    }

    await sequelize.query(
      `EXEC psp_upd_product_status @product_id = :id, @state_id = :state_id`,
      {
        replacements: {
          id,
          state_id,
        },
        type: sequelize.QueryTypes.RAW,
      }
    );

    res.status(200).json({ message: `Estado actualizado exitosamente` });
  } catch (err) {
    res.status(500).json({ error: "Se produjo un error" });
  }
};
