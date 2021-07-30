import { getConnection, querys } from "../database";

//all users
export const getUsers = async (req, res) => {
    try {
        //llamando a la conexion
        const connection = await getConnection();
        //realizamos una consulta con la variable que nos retorna la conexion
        const result = await connection.request()
        .input("id",0)
        .input("A", "L")
        .query(querys.crupUsers);
        //mostrando resultado en formato json
        res.json(result.recordset);

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

//only user
export const getUserById = async (req, res) => {
    try {
      const connection = await getConnection();
      const result = await connection
        .request()
        .input("id", req.params.id)
        .input("A", "B")
        .query(querys.crupUsers);
      return res.json(result.recordset[0]);
    } catch (error) {
      res.status(500);
      res.send(error.message);
    }
  };