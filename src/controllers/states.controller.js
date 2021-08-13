import { getConnection, querys } from "../database";

//all states
export const getStates = async (req, res) => {
  try {

    const connection = await getConnection();
    const result = await connection.request()
      .input("id", 0)
      .input("A", "L")
      .query(querys.getEstate);
    res.json(result.recordset);

  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

//only state
export const getStateById = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input("id", req.params.id)
      .input("A", "B")
      .query(querys.getEstate);
    res.json(result.recordset[0]);

  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};