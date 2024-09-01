import jwt from "jsonwebtoken";

import sequelize from "../db.js";

import { createUser } from "./userController.js";

import { comparePassword } from "../utils/encryptPassword.js";

import { JWT_SECRET } from "../config.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res
      .status(400)
      .json({ error: "Se requieren correo electrónico y contraseña" });
    return;
  }

  try {
    const [result] = await sequelize.query(
      `EXEC usp_get_user_by_email @email = :email`,
      {
        replacements: { email },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!result) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    const passwordMatch = await comparePassword(password, result.password);

    if (!passwordMatch) {
      res.status(400).json({ error: "La contraseña es incorrecta" });
      return;
    }

    const token = jwt.sign({ user_id: result.user_id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: result,
      access: token,
    });
  } catch (err) {
    res.status(500).json({ error: "Se produjo un error" });
  }
};

export const register = async (req, res) => {
  const { first_name, last_name, email, password, role_id, state_id } =
    req.body;

  if (
    !first_name ||
    !last_name ||
    !email ||
    !password ||
    !role_id ||
    !state_id
  ) {
    res.status(400).json({ error: "Faltan campos obligatorios" });
    return;
  }

  try {
    const [user] = await sequelize.query(
      `EXEC usp_get_user_by_email @email = :email`,
      {
        replacements: {
          email: email,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (user) {
      res.status(400).json({ error: "Ya existe un usuario con ese correo" });
      return;
    }

    const [role] = await sequelize.query(
      `EXEC usp_get_roles @role_id = :role_id`,
      {
        replacements: {
          role_id,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!role) {
      res.status(400).json({ error: "El rol no existe" });
      return;
    }

    const [state] = await sequelize.query(
      `EXEC ssp_get_states @state_id = :state_id`,
      {
        replacements: {
          state_id,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!state) {
      res.status(400).json({ error: "El estado no existe" });
      return;
    }

    const result = await createUser(req, res);

    const token = jwt.sign({ user_id: result.user.user_id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({ ...result, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Se produjo un error" });
  }
};

export const logout = (req, res) => {
  res.status(200).json({ message: "logout" });
};

export const refreshToken = (req, res) => {
  res.status(200).json({ message: "refresh token" });
};
