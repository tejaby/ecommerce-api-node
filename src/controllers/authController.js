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
    const result = await sequelize.query(
      `EXEC usp_get_user_by_email @email = :email`,
      {
        replacements: { email },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!result[0]) {
      res.status(404).json({ message: "usuario no encontrado" });
      return;
    }

    const passwordMatch = await comparePassword(password, result[0].password);

    if (!passwordMatch) {
      res.status(400).json({ error: "la contraseña es incorrecta" });
      return;
    }

    const token = jwt.sign(
      { user_id: result[0].user_id, role_id: result[0].role_id },
      JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res
      .status(200)
      .json({ message: "inicio de sesión exitoso", user: result[0], token });
  } catch (err) {
    res.status(500).json({ error: "se produjo un error" });
  }
};

export const register = async (req, res) => {
  try {
    const result = await createUser(req, res);

    const token = jwt.sign(
      { user_id: result.user.user_id, role_id: result.user.role_id },
      JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.status(200).json({ ...result, token });
  } catch (err) {
    res.status(500).json({ error: "se produjo un error" });
  }
};

export const logout = (req, res) => {
  res.status(200).json({ message: "logout" });
};

export const refreshToken = (req, res) => {
  res.status(200).json({ message: "refresh token" });
};
