import sequelize from "../db.js";

import { encryptPassword } from "../utils/encryptPassword.js";

export const listUsers = async (req, res) => {
  try {
    const result = await sequelize.query(`EXEC usp_list_users`, {
      type: sequelize.QueryTypes.SELECT,
    });
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ error: "se produjo un error" });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sequelize.query(`EXEC usp_get_users @user_id = :id`, {
      type: sequelize.QueryTypes.SELECT,
      replacements: {
        id,
      },
    });
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ error: "se produjo un error" });
  }
};

export const createUser = async (req, res) => {
  const { first_name, last_name, email, password, role_id } = req.body;

  if (!first_name || !last_name || !email || !password || !role_id) {
    res.status(400).json({ message: "faltan campos obligatorios" });
    return;
  }

  try {
    const passwordHash = await encryptPassword(password);

    const [result] = await sequelize.query(
      `EXEC usp_ins_users @first_name = :first_name, @last_name = :last_name, @email = :email, @password = :passwordHash, @role_id = :role_id`,
      {
        replacements: {
          first_name,
          last_name,
          email,
          passwordHash,
          role_id,
        },
        type: sequelize.QueryTypes.RAW,
      }
    );

    res.status(200).json({ message: `Usuario creado exitosamente` });
  } catch (err) {
    res.status(500).json({ message: "se produjo un error" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { first_name = null, last_name = null, email = null } = req.body;

  try {
    const result = await sequelize.query(
      `EXEC usp_upd_users @user_id = :id, @first_name = :first_name, @last_name = :last_name, @email = :email`,
      {
        replacements: {
          id,
          first_name,
          last_name,
          email,
        },
        type: sequelize.QueryTypes.RAW,
      }
    );

    res.status(200).json({ message: `Usuario actualizado exitosamente` });
  } catch (err) {
    res.status(500).json({ error: "se produjo un error" });
  }
};

export const changePassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password) {
    res.status(400).json({ message: "faltan campos obligatorios" });
    return;
  }

  try {
    const passwordHash = await encryptPassword(password);

    const result = sequelize.query(
      `EXEC usp_upd_users @user_id = :id, @password = :passwordHash`,
      {
        replacements: {
          id,
          passwordHash,
        },
        type: sequelize.QueryTypes.RAW,
      }
    );

    res.status(200).json({ message: `Contraseña cambiada exitosamente` });
  } catch (err) {
    res.status(500).json({ error: "se produjo un error" });
  }
};

export const deleteUser = (req, res) => {
  const { id } = req.params;

  try {
    const result = sequelize.query(`EXEC usp_del_users @user_id = :id`, {
      replacements: {
        id,
      },
      type: sequelize.QueryTypes.RAW,
    });

    res.status(200).json({ message: `Usuario desactivado exitosamente` });
  } catch (err) {
    res.status(500).json({ error: "se produjo un error" });
  }
};
