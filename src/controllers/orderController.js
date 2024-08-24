import sequelize from "../db.js";

export const createOrderWithDetails = async (req, res) => {
  const { address, phone_number, total_amount, user_id, order_details } =
    req.body;

  if (
    !address ||
    !phone_number ||
    !total_amount ||
    !user_id ||
    !order_details
  ) {
    res.status(400).json({ error: "faltan campos obligatorios" });
    return;
  }

  try {
    const serializedOrderDetails = JSON.stringify(order_details);

    const result = await sequelize.query(
      `EXEC usp_create_order_with_details @address = :address, @phone_number = :phone_number, @total_amount = :total_amount, @user_id = :user_id, @order_details = :order_details`,
      {
        replacements: {
          address,
          phone_number,
          total_amount,
          user_id,
          order_details: serializedOrderDetails,
        },
        type: sequelize.QueryTypes.RAW,
      }
    );

    res.status(200).json({ message: "Pedido creado exitosamente" });
  } catch (err) {
    res.status(500).json({ error: "se produjo un error" });
  }
};

export const updateOrderHeader = async (req, res) => {
  const { id } = req.params;
  const { address = null, phone_number = null } = req.body;

  try {
    const result = await sequelize.query(
      `EXEC usp_upd_orders @address = :address, @phone_number = :phone_number, @order_id = :id`,
      {
        replacements: {
          address,
          phone_number,
          id,
        },
        type: sequelize.QueryTypes.RAW,
      }
    );

    res.status(200).json({ message: "Pedido actualizado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "se produjo un error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { state } = req.body;

  try {
    const result = await sequelize.query(
      `EXEC usp_upd_orders @state = :state, @order_id = :id`,
      {
        replacements: {
          state,
          id,
        },
        type: sequelize.QueryTypes.RAW,
      }
    );

    res.status(200).json({ message: "Pedido cancelado exitosamente" });
  } catch (err) {
    res.status(500).json({ error: "se produjo un error" });
  }
};
