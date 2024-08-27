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
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: "Faltan campos obligatorios" });
    return;
  }

  try {
    const [category] = await sequelize.query(
      `SELECT * FROM categories WHERE name = :name`,
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

    const result = await sequelize.query(
      `EXEC csp_ins_categories @name = :name, @user_id = :user_id`,
      {
        replacements: {
          name,
          user_id,
        },
        type: sequelize.QueryTypes.RAW,
      }
    );

    res.json({ message: `Categoría creada exitosamente` });
  } catch (err) {
    res.status(500).json({ error: "Se produjo un error" });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name = null } = req.body;

  try {
    const [category] = await sequelize.query(
      `SELECT * FROM categories WHERE name = :name`,
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

    const [getCategory] = await sequelize.query(
      `SELECT * FROM categories WHERE category_id = :id`,
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

    const result = await sequelize.query(
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

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const [category] = await sequelize.query(
      `SELECT * FROM categories WHERE category_id = :id`,
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

    const result = await sequelize.query(
      `EXEC csp_del_categories @category_id = :id`,
      {
        replacements: {
          id,
        },
        type: sequelize.QueryTypes.RAW,
      }
    );

    res.json({ message: `Categoría desactivada exitosamente` });
  } catch (err) {
    res.status(500).json({ error: "Se produjo un error" });
  }
};
