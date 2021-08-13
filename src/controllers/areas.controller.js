import { getConnection, querys } from "../database";

//all areas
export const getAreas = async (req, res) => {
  try {

    const connection = await getConnection();
    const result = await connection.request()
      .input("id", 0)
      .input("var", "")
      .input("A", "L")
      .input("es", 0)
      .query(querys.getArea);
    res.json(result.recordset);

  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

//only area
export const getAreaById = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input("id", req.params.id)
      .input("var", "")
      .input("A", "B")
      .input("es",1)
      .query(querys.getArea);
    res.json(result.recordset[0]);

  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

//insert area
export const createNewArea = async (req, res) => {
    const {nombre} = req.body;
  
    if (nombre == "") {
      return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
    }
    try {
      const connection = await getConnection();
      await connection
        .request()
        .input("id", 0)
        .input("var", nombre)
        .input("A", "I")
        .input("es",1)
        .query(querys.getArea);
  
      res.json({ msg: "fields affected" })
    }
    catch (error) {
      res.status(500);
      res.send(error.message);
    }
  };

//update area
export const updateAreaById = async (req, res) => {
  const { idArea, descripcion, idEstado} = req.body;

  var idA = parseInt(idArea);
  var idE = parseInt(idEstado);

  if (isNaN(idA) || isNaN(idE) || descripcion == "") {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const connection = await getConnection();
    await connection
      .request()
      .input("id", idA)
      .input("var", descripcion)
      .input("A", "U")
      .input("es",idE)
      .query(querys.getArea);

    res.json({ msg: "fields affected" })
  }
  catch (error) {
    res.status(500);
    res.send(error.message);
  }
};