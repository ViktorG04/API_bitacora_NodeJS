import { getConnection, querys } from "../database";

//login user
export const getUserLogin = async (req, res) => {
  const { correo, password } = req.body;

  if (correo == "" || password == "") {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }
  try {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input("email", correo)
      .input("pass", password)
      .query(querys.getLogin);

    if (result.rowsAffected == 0) {
      return res.status(400).json({ msg: "Bad Request. wrong username or password" });
    }

    if (result.recordset[0]['estado'] != 1) {
      return res.status(400).json({ msg: "Bad Request. User inactive" });
    }
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }

};