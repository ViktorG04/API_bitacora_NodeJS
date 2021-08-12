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