import { getConnection, querys, sql } from "../database";

//all companies
export const getCompanies = async (req, res) => {
  try {

    const connection = await getConnection();
    const result = await connection.request()
      .input("id", 0)
      .input("A", "LTE")
      .query(querys.listEEPS);
    res.json(result.recordset);

  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

//update company
export const updateCompanyById = async (req, res) => {
  const { nombre, idTipo, idEstado } = req.body;

  var idT = parseInt(idTipo);
  var idE = parseInt(idEstado);

  if (isNaN(idT) || isNaN(idE) || nombre == "") {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }
  try {
    const connection = await getConnection();
    await connection
      .request()
      .input("A", "U")
      .input("id", req.params.id)
      .input("nm", nombre)
      .input("tp", idT)
      .input("es", idE)
      .query(querys.IUEntity);

    res.json({ msg: "fields affected" })
  }
  catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

//search company by name
export const getCompanyByName = async (req, res) => {
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
      .input("A", "E")
      .input("value", value)
      .query(querys.getSearch);

    res.json(result.recordset);

  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

//add new company
export const createNewCompany = async(nombre, idTipo) =>{
  const A = 'I';
  const idE = 1;
  const idEm = 0;
  try {
    const connection = await getConnection();
    const result = await connection
    .request()
    .input("A", A)
    .input("id", idEm)
    .input("nm", nombre)
    .input("tp", idTipo)
    .input("es", idE)
    .query(querys.IUEntity);
    return result.recordset[0]['ID'];
  } catch (error) {
    console.error(error)
  }
}