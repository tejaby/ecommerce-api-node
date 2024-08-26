import sequelize from "../db.js";

export const listCategories = async (req, res) => {
  try {
    const result = await sequelize.query(`EXEC csp_list_categories`, {
      type: sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ error: "se produjo un error" });
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
    res.status(500).json({ error: "se produjo un error" });
  }
};

export const createCategory = async (req, res) => {
  const { user_id } = req.user;
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: "faltan campos obligatorios" });
    return;
  }

  try {
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
    res.status(500).json({ error: "se produjo un error" });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name = null } = req.body;

  try {
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
    res.status(500).json({ error: "se produjo un error" });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
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
    res.status(500).json({ error: "se produjo un error" });
  }
};
