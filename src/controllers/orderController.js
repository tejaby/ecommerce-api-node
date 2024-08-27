import sequelize from "../db.js";

export const createOrderWithDetails = async (req, res) => {
  const { user_id } = req.user;
  const { address, phone_number, total_amount, order_details } = req.body;

  if (!address || !phone_number || !total_amount || !order_details) {
    res.status(400).json({ error: "Faltan campos obligatorios" });
    return;
  }

  try {
    const products = [];

    for (const order of order_details) {
      const [product] = await sequelize.query(
        `EXEC usp_get_product_by_user_price @product_id = :product_id, @price = :price`,
        {
          replacements: {
            product_id: order.product_id,
            price: order.price,
          },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (product) {
        products.push(product);
      }
    }

    if (products.length != order_details.length) {
      res.status(400).json({ error: "Uno o más productos no son válidos" });
      return;
    }

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
    console.log(err);
    res.status(500).json({ error: "Se produjo un error" });
  }
};

export const updateOrderHeader = async (req, res) => {
  const { user_id } = req.user;
  const { id } = req.params;
  const { address = null, phone_number = null } = req.body;

  try {
    const [order] = await sequelize.query(
      `EXEC usp_get_orders @order_id = :id`,
      {
        replacements: {
          id,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!order) {
      res.status(404).json({ error: "No se encontró el pedido" });
      return;
    }

    if (order.user_id != user_id) {
      res
        .status(403)
        .json({ error: "No tienes permisos para actualizar este pedido" });
      return;
    }

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
    res.status(500).json({ error: "Se produjo un error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { user_id } = req.user;
  const { id } = req.params;
  const { state } = req.body;

  const validStates = ["cancelled", "pending"];
  if (!state || !validStates.includes(state)) {
    return res.status(400).json({ error: "Estado no válido o faltante" });
  }

  try {
    const [order] = await sequelize.query(
      `EXEC usp_get_orders @order_id = :id`,
      {
        replacements: {
          id,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!order) {
      res.status(404).json({ error: "No se encontró el pedido" });
      return;
    }

    if (order.user_id != user_id) {
      res
        .status(403)
        .json({ error: "No tienes permisos para actualizar este pedido" });
      return;
    }

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
    res.status(500).json({ error: "Se produjo un error" });
  }
};
