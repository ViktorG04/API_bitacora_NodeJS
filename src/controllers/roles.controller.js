import { getConnection, querys } from "../database";

//all roles
export const getRoles = async (req, res) => {
  try {

    const connection = await getConnection();
    const result = await connection.request()
      .input("id", 0)
      .input("var", "")
      .input("A", "L")
      .query(querys.getRol);
    res.json(result.recordset);

  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

//only rol
export const getRolById = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input("id", req.params.id)
      .input("var", "")
      .input("A", "B")
      .query(querys.getRol);
    res.json(result.recordset[0]);

  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

//update rol
export const updateRolById = async (req, res) => {
  const { idRol, nombre} = req.body;

  var idR = parseInt(idRol);

  if (isNaN(idR) || nombre == "") {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }
  try {
    const connection = await getConnection();
    await connection
      .request()
      .input("A", "U")
      .input("id", idR)
      .input("var", nombre)
      .query(querys.getRol);

    res.json({ msg: "fields affected" })
  }
  catch (error) {
    res.status(500);
    res.send(error.message);
  }
};