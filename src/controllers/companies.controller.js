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

//all companies by id
export const getCompanyById = async (req, res) => {
  try {

    const connection = await getConnection();
    const result = await connection.request()
      .input("id", req.params.id)
      .input("A", "LEI")
      .query(querys.listEEPS);
    res.json(result.recordset[0]);

  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

//update company
export const updateCompanyById = async (req, res) => {
  const { idEmpresa, nombre, idTipo, idEstado } = req.body;

  var idEm, idT, idE;
  idEm = parseInt(idEmpresa);
  idT = parseInt(idTipo);
  idE = parseInt(idEstado);

  if (isNaN(idEm) || isNaN(idT) || isNaN(idE) || nombre == "") {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }
  if(idE == 1 || idE == 2){
    try {
      const connection = await getConnection();
      await connection
        .request()
        .input("A", "U")
        .input("id", idEm)
        .input("nm", nombre)
        .input("tp", idT)
        .input("es", idE)
        .query(querys.IUEntity);
  
      res.json({ msg: "fields affected" })
    }
    catch (error) {
      res.status(500);
      res.send(error.message);
      console.error(error);
    }
  }
  else{
    return res.status(400).json({ msg: "Bad Request. Please estate active = 1 or inactive = 2" });
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