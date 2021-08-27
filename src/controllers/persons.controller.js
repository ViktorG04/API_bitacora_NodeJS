import { getConnection, querys } from "../database";

//all persons
export const getPersons = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.request()
      .input("id", 0)
      .input("A", "LTP")
      .query(querys.listEEPS);
    res.json(result.recordset);

  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

//all persons by company
export const getPersonsbyCompany = async (req, res) => {
  const { id } = req.body;
  try {
    const connection = await getConnection();
    const result = await connection.request()
      .input("id", id)
      .input("A", "LPE")
      .query(querys.listEEPS);
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

//only person
export const getPersonById = async (req, res) => {
  const { id } = req.body;
  try {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input("id", id)
      .input("A", "BP")
      .query(querys.listEEPS);
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//update person
export const updatePersonById = async (req, res) => {
  const { id, nombre, docIdentidad, idEmpresa, idEstado } = req.body;

  const A = 'U';
  var idP = parseInt(id);
  var idEm = parseInt(idEmpresa);
  var idE = parseInt(idEstado);

  if (isNaN(idP) || isNaN(idEm) || isNaN(idE) || nombre == "" || docIdentidad == "") {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const connection = await getConnection();
    await connection
      .request()
      .input("A", A)
      .input("nom", nombre)
      .input("doc", docIdentidad)
      .input("emp", idEm)
      .input("est", idE)
      .input("id", idP)
      .query(querys.getPersons);
    res.json({ msg: "fields affected" })
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

//insert person
export const createNewPerson = async (nombre, docIdentidad, idEm) => {
  const idE = 1;
  const A = 'I';
  const idP = 0;
  try {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input("A", A)
      .input("nom", nombre)
      .input("doc", docIdentidad)
      .input("emp", idEm)
      .input("est", idE)
      .input("id", idP)
      .query(querys.getPersons);
    return result.recordset[0]['ID'];
  } catch (error) {
    console.error(error)
  }
};

//validate docIdentity
export const getValidateDui = async (req, res) => {
  const { dui } = req.body;
  try {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input("A", 'D')
      .input("var", dui)
      .query(querys.validatePerson);
    var R = result.recordset[0]['V'];
    if (R != 0) {
      return res.status(400).json({ msg: "Bad Request. please enter a different DUI" });
    }
    else {
      return res.status(200).json({ msg: "OK" });
    }
  } catch (error) {
    error.message;
  }
};

//search person by name
export const getPersonByName = async (req, res) => {
  const { nombre } = req.body;
  const like = "%";
  if (nombre == "") {
    return res.status(400).json({ msg: "Bad Request. Please fill all field" });
  }
  var value = nombre + like;
  console.log(value);
  try {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input("A", "P")
      .input("value", value)
      .query(querys.getSearch);

    res.json(result.recordset);

  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};