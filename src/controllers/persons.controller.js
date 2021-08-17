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
  try {

    const connection = await getConnection();
    const result = await connection.request()
      .input("id", req.params.id)
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
  try {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input("id", req.params.id)
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
    const result = await connection
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