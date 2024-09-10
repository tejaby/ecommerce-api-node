import sequelize from "../db.js";

export const listCategories = async (req, res) => {
  try {
    const result = await sequelize.query(`EXEC csp_list_categories`, {
      type: sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ error: "Se produjo un error" });
  }
};

export const listCategoriesExtended = async (req, res) => {
  try {
    const result = await sequelize.query(
      `EXEC csp_list_categories_with_details`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ error: "Se produjo un error" });
  }
};

export const getCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sequelize.query(
      `EXEC csp_get_categories @category_id = :id`,
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

export const createCategory = async (req, res) => {
  const { user_id } = req.user;
  const { name, state_id } = req.body;

  if (!name || !state_id) {
    res.status(400).json({ error: "Faltan campos obligatorios" });
    return;
  }

  try {
    const [category] = await sequelize.query(
      `EXEC csp_get_category_by_name @name = :name`,
      {
        replacements: {
          name,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (category) {
      res.status(400).json({ error: "La categoría ya existe" });
      return;
    }

    const [result] = await sequelize.query(
      `EXEC csp_ins_categories @name = :name, @user_id = :user_id, @state_id = :state_id`,
      {
        replacements: {
          name,
          user_id,
          state_id,
        },
        type: sequelize.QueryTypes.RAW,
      }
    );

    res.json({ message: `Categoría creada exitosamente`, data: result[0] });
  } catch (err) {
    res.status(500).json({ error: "Se produjo un error" });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name = null } = req.body;

  try {
    const [category] = await sequelize.query(
      `EXEC csp_get_category_by_name @name = :name`,
      {
        replacements: {
          name,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (category && category.category_id != id) {
      res.status(400).json({ error: "La categoría ya existe" });
      return;
    }

    const [getCategory] = await sequelize.query(
      `EXEC csp_get_categories @category_id = :id`,
      {
        replacements: {
          id,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!getCategory) {
      res.status(404).json({ error: "La categoría no existe" });
      return;
    }

    await sequelize.query(
      `EXEC csp_upd_categories @category_id = :id, @name = :name`,
      {
        replacements: {
          id,
          name,
        },
        type: sequelize.QueryTypes.RAW,
      }
    );

    res.json({ message: `Categoría actualizada exitosamente` });
  } catch (err) {
    res.status(500).json({ error: "Se produjo un error" });
  }
};

export const updateCategoryState = async (req, res) => {
  const { id } = req.params;
  const { state_id } = req.body;

  if (!state_id) {
    res.status(400).json({ error: "Falta el estado" });
    return;
  }

  try {
    const [category] = await sequelize.query(
      `EXEC csp_get_categories @category_id = :id`,
      {
        replacements: {
          id,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!category) {
      res.status(404).json({ error: "La categoría no existe" });
      return;
    }

    if (state_id === 2) {
      const products = await sequelize.query(
        `EXEC psp_list_products_by_category @category_id = :id`,
        {
          replacements: {
            id,
          },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (products.length > 0) {
        res
          .status(400)
          .json({ error: "La categoría no puede ser desactivada" });
        return;
      }
    }

    await sequelize.query(
      `EXEC csp_upd_categorie_status @category_id = :id, @state_id = :state_id`,
      {
        replacements: {
          id,
          state_id,
        },
        type: sequelize.QueryTypes.RAW,
      }
    );

    res.json({ message: `Estado actualizado exitosamente` });
  } catch (err) {
    res.status(500).json({ error: "Se produjo un error" });
  }
};
