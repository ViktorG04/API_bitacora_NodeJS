import { getConnection, querys } from "../database";
//import {validarDui} from "./validation";

//only user
export const getUserById = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input("id", req.params.id)
      .input("A", "BE")
      .query(querys.listEEPS);
    return res.json(result.recordset[0]);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

//insert employee
export const createNewUser = async (req, res) => {
  const { nombre, dui, correo, idRol } = req.body;

  //const
  let idE = 1;
  let idEm = 1;
  let user = "";
  let pass = "12345678";

  var result;
  var idR = parseInt(idRol);

  if (nombre == "" || dui == "" || correo == "" || isNaN(idR)) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  //validate docIdentity
  result = await ValidarCampo(dui, 'D');
  if (result != 0) {
    return res.status(400).json({ msg: "Bad Request. please enter a different DUI" });
  }

  //validate correo
  result = await ValidarCampo(correo, 'C');
  if (result != 0) {
    return res.status(400).json({ msg: "Bad Request. please enter a different Correo" });
  }

  //user by correo
  var list = correo.split('@');
  user = list[0];

  try {
    const connection = await getConnection();
    await connection
      .request()
      .input("id", 0)
      .input("A", "I")
      .input("user", user)
      .input("co", correo)
      .input("pas",pass)
      .input("nom", nombre)
      .input("doc", dui)
      .input("rol", idR)
      .input("em", idEm)
      .input("est",idE)
      .query(querys.getEmployee);

    res.json({ msg: "fields affected" })
  }
  catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


async function ValidarCampo(valor, Action) {
  try {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input("A", Action)
      .input("var", valor)
      .query(querys.validatePerson);
    var R = result.recordset[0]['V'];
    return R;
  } catch (error) {
    error.message;
  }
};