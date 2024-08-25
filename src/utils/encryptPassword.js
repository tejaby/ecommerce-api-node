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

export const comparePassword = async (password, hashedPassword) => {
  try {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
  } catch (err) {
    throw new Error(`Error comparando la contraseña: ${err}`);
  }
};
