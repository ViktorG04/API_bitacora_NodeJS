import { getConnection, querys } from "../database";
import bcrypt from "bcryptjs";

//login user
export const getUserLogin = async (req, res) => {
  const { correo, password } = req.body;
  var result, validate;
  if (correo == "" || password == "") {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  result = await dataLogin(correo);
  if (result == null) {
    return res.status(400).json({ msg: "Bad Request. Email Incorrecto" });
  }

  validate = bcrypt.compareSync(password, result['pass']);
  if (validate != true) {
    return res.status(400).json({ msg: "Bad Request. Contraseña Incorrecta" });
  }

  if (result['estado'] != 1) {
    return res.status(400).json({ msg: "Bad Request. Usuario Inactivo" });
  }
  delete result.pass;
  delete result.estado;

  res.json(result);

};

async function dataLogin(email) {
  try {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input("email", email)
      .query(querys.getLogin);
    return result.recordset[0];
  } catch (error) {
    console.error(error);
  }
};
