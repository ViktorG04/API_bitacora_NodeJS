import { getConnection, querys } from "../database";

//all users
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

//all users by company
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

//only user
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