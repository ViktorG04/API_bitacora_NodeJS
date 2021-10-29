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
  var id = req.params.id;
  try {
    const connection = await getConnection();
    const result = await connection.request()
      .input("id", id)
      .input("A", 'LPE')
      .query(querys.listEEPS);
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

//only person
export const getPersonById = async (req, res) => {
  var idP, result, A;

  idP = req.params.id;

  result = await detalleEmployee(idP, 'B')

  if (result['idEmpleado'] != null) {
    A = "BE";
  } else {
    A = "BP";
  }
  try {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input("id", idP)
      .input("A", A)
      .query(querys.listEEPS);
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//update person
export const updatePersonById = async (req, res) => {
  const { idPersona, nombreCompleto, docIdentidad, idEmpresa} = req.body;

  const A = 'U';
  var idP, idEm;
  idP = parseInt(idPersona);
  idEm = parseInt(idEmpresa);

  if (isNaN(idP) || isNaN(idEm) || nombreCompleto == "" || docIdentidad == "") {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }
  try {
      const connection = await getConnection();
      await connection
        .request()
        .input("A", A)
        .input("nom", nombreCompleto)
        .input("doc", docIdentidad)
        .input("emp", idEm)
        .input("est", '')
        .input("id", idP)
        .query(querys.getPersons);
      res.json({ msg: "fields affected" })
    } catch (error) {
      res.status(500);
      res.send(error.message);
      console.error(error);
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

//update state person
export const updateStatePerson = async (req, res) => {
  const { id, estado } = req.body;

  var idP, idE;

  idP = parseInt(id);
  idE = parseInt(estado);
  if (isNaN(idP) || isNaN(idE)) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  if (idE == 1 || idE == 2) {

    try {
      const connection = await getConnection();
      await connection
        .request()
        .input("est", idE)
        .input("id", idP)
        .query(querys.updateState);
      res.json({ msg: "Updated status" })
    } catch (error) {
      res.status(500);
      res.send(error.message);
      console.error(error);
    }
  } else {
    return res.status(400).json({ msg: "Bad Request. Please estate active = 1 or inactive = 2" });
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
      .query(querys.validateDocandEmail);
    var R = result.recordset[0]['V'];
    if (R != 0) {
      return res.status(400).json({ msg: "Bad Request. please enter a different DUI" });
    }
    else {
      return res.status(200).json({ msg: "OK" });
    }
  } catch (error) {
    res.status(500);
    res.send(error.message);
    console.error(error);
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
    console.error(error);
  }
};

//search idPerson
export const detalleEmployee = async (id, action) => {
  try {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input("A", action)
      .input("id", id)
      .query(querys.getDataEmployee);
    var R
    if (action != 'U') {
      R = result.recordset[0];
    }
    else {
      R = result.recordset;
    }
    return R;
  } catch (error) {
    console.error(error);
  }
};