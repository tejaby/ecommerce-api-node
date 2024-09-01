import sequelize from "../db.js";

export const adminMiddleware = async (req, res, next) => {
  const { user_id } = req.user;

  if (!user_id) {
    return res.status(403).json({ error: "Usuario no autenticado" });
  }

  try {
    const [result] = await sequelize.query(
      `EXEC usp_get_users @user_id = :user_id`,
      {
        replacements: {
          user_id,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!result) {
      return res.status(403).json({ error: "Usuario no encontrado" });
    }

    const [rol] = await sequelize.query(
      `EXEC usp_get_roles @role_id = :role_id`,
      {
        replacements: {
          role_id: result.role_id,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!rol) {
      return res.status(403).json({ error: "Rol no encontrado" });
    }

    if (rol.role_name != "admin") {
      return res.status(403).json({ error: "No tienes permisos" });
    }

    next();
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error al verificar el rol del usuario" });
  }
};
