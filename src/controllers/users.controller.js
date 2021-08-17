import { getConnection, querys } from "../database";

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
  const Action = "I";
  const id = 0;
  const idE = 1;
  const idEm = 1;
  var user = "";
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

  //insert users
  var resulAction;
  resulAction = await IUEmployee(id, Action, user, correo, pass, nombre, dui, idR, idEm, idE);

  res.json({ resulAction });

};

//update Employee
export const updateUserById = async (req, res) => {
  const { idUsuario, nombre, dui, correo, idRol, password, idEstado } = req.body;

  const Action = "U";
  const idEm = 1;
  
  var idU = parseInt(idUsuario);
  var idR = parseInt(idRol);
  var idE = parseInt(idEstado);

  if (isNaN(idU) || isNaN(idR) || isNaN(idE) || nombre == ""
    || dui == "" || correo == "" || password == "") {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  //user by correo
  var list = correo.split('@');
  var user = list[0];

  //call update
  var resulAction;
  resulAction = await IUEmployee(idU, Action, user, correo, password, nombre, dui, idR, idEm, idE);

  res.json({ resulAction });

};

//validate doc identity and email
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

//insert or update in db
async function IUEmployee(id, A, U, Co, Pas, Nm, D, R, Em, E) {
  try {
    const connection = await getConnection();
    await connection
      .request()
      .input("id", id)
      .input("A", A)
      .input("user", U)
      .input("co", Co)
      .input("pas", Pas)
      .input("nom", Nm)
      .input("doc", D)
      .input("rol", R)
      .input("em", Em)
      .input("est", E)
      .query(querys.getEmployee);
    var msg;
    return msg = "fields affected";
  }
  catch (error) {
    error.message;
  }
};