import { getConnection, querys } from "../database";


export const ValidarDui = async (dui) => {
    try {
      const connection = await getConnection();
      const result = await connection
        .request()
        .input("A", "D")
        .input("var", dui)
        .query(querys.validatePerson);
      var R = result.recordset[0]['V'];
      console.log(R);
      return R;
    } catch (error) {
        console.error(error);
    }
  };