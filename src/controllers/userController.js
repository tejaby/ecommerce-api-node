import sequelize from "../db.js";

import { encryptPassword, comparePassword } from "../utils/encryptPassword.js";

export const listUsers = async (req, res) => {
  try {
    const result = await sequelize.query(`EXEC usp_list_users`, {
      type: sequelize.QueryTypes.SELECT,
    });
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ error: "Se produjo un error" });
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
    res.status(500).json({ error: "Se produjo un error" });
  }
};

export const createUser = async (req, res) => {
  const { first_name, last_name, email, password, role_id, state_id } =
    req.body;

  try {
    const passwordHash = await encryptPassword(password);

    const [result] = await sequelize.query(
      `EXEC usp_ins_users @first_name = :first_name, @last_name = :last_name, @email = :email, @password = :passwordHash, @role_id = :role_id, @state_id = :state_id`,
      {
        replacements: {
          first_name,
          last_name,
          email,
          passwordHash,
          role_id,
          state_id,
        },
        type: sequelize.QueryTypes.RAW,
      }
    );

    return { message: `Usuario creado exitosamente`, user: result[0] };
  } catch (err) {
    return err;
  }
};

export const updateUser = async (req, res) => {
  const { user_id } = req.user;
  const { first_name = null, last_name = null, email = null } = req.body;

  try {
    if (email) {
      const [user] = await sequelize.query(
        `EXEC usp_get_user_by_email @email = :email`,
        {
          replacements: {
            email,
          },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (user) {
        res.status(400).json({ error: "Ya existe un usuario con ese correo" });
      }
    }

    const result = await sequelize.query(
      `EXEC usp_upd_users @user_id = :user_id, @first_name = :first_name, @last_name = :last_name, @email = :email`,
      {
        replacements: {
          user_id,
          first_name,
          last_name,
          email,
        },
        type: sequelize.QueryTypes.RAW,
      }
    );

    res.status(200).json({ message: `Usuario actualizado exitosamente` });
  } catch (err) {
    res.status(500).json({ error: "Se produjo un error" });
  }
};

export const changePassword = async (req, res) => {
  const { user_id } = req.user;
  const { password, new_password } = req.body;

  if (!password || !new_password) {
    res.status(400).json({ error: "Faltan campos obligatorios" });
    return;
  }

  try {
    const [user] = await sequelize.query(
      `EXEC usp_get_users @user_id = :user_id`,
      {
        replacements: {
          user_id,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      res.status(400).json({ error: "La contraseña es incorrecta" });
      return;
    }

    const passwordHash = await encryptPassword(new_password);

    const result = sequelize.query(
      `EXEC usp_upd_users @user_id = :user_id, @password = :passwordHash`,
      {
        replacements: {
          user_id,
          passwordHash,
        },
        type: sequelize.QueryTypes.RAW,
      }
    );

    res.status(200).json({ message: `Contraseña cambiada exitosamente` });
  } catch (err) {
    res.status(500).json({ error: "Se produjo un error" });
  }
};

export const updateUserState = (req, res) => {
  const { user_id } = req.user;
  const { state_id } = req.body;

  if (!state_id) {
    res.status(400).json({ error: "Falta el estado" });
    return;
  }

  try {
    const result = sequelize.query(`EXEC usp_upd_user_status @user_id = :user_id, @state_id = :state_id`, {
      replacements: {
        user_id,
        state_id,
      },
      type: sequelize.QueryTypes.RAW,
    });

    res.status(200).json({ message: `Usuario desactivado exitosamente` });
  } catch (err) {
    res.status(500).json({ error: "Se produjo un error" });
  }
};
