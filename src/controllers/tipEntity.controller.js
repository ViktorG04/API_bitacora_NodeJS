import { getConnection, querys } from "../database";

//all tip entity
export const getTipEntity = async (req, res) => {
  try {

    const connection = await getConnection();
    const result = await connection.request()
      .input("id", 0)
      .input("A", "L")
      .query(querys.getTipEmp);
    res.json(result.recordset);

  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

//only tip entity
export const getTipEntityById = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input("id", req.params.id)
      .input("A", "B")
      .query(querys.getTipEmp);
    res.json(result.recordset[0]);

  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};