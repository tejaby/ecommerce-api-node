import bcrypt from "bcrypt";

const saltRounds = 10;

export const encryptPassword = async (password) => {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (err) {
    throw new Error(`Error encriptando la contraseña: ${err}`);
  }
};
