import { getConnection, querys } from "../database";

//all areas
export const getAreas = async (req, res) => {
 var result = await crupAreas(0, '', 'L', 0);
 res.json(result);
};

//only area
export const getAreaById = async (req, res) => {
  var result = await crupAreas(req.params.id, '', 'B', '');
  res.json(result[0]);
};

//insert area
export const createNewArea = async (req, res) => {
    const {nombre, estado, capacidad} = req.body;
    var idE = parseInt(estado);
    var maxPeople = parseInt(capacidad);
    if (nombre == "" || isNaN(idE) || isNaN(maxPeople)) {
      return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
    }
    if(idE == 1 || idE == 2){
      var result = await crupAreas(0, nombre, 'I', idE, maxPeople)
      res.json({result});
    }else{
      return res.status(400).json({ msg: "Bad Request. Please estate active = 1 or inactive = 2" });
    }
  };

//update area
export const updateAreaById = async (req, res) => {
  const { idArea, nombre, estado, capacidad} = req.body;

  var idA, idE, maxPeople;
  idA = parseInt(idArea);
  idE = parseInt(estado);
  maxPeople = parseInt(capacidad);

  if (isNaN(idA) || isNaN(idE) || nombre == "" || isNaN(maxPeople)) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }
  if(idE == 1 || idE == 2){
    var result = await crupAreas(idA, nombre, 'U', idE, maxPeople);
    res.json({result});
  }else{
    return res.status(400).json({ msg: "Bad Request. Please estate active = 1 or inactive = 2" });
  }
};

//function crup in database
async function crupAreas(id, area, action, estado, max){
  try {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input("id", id)
      .input("var", area)
      .input("A", action)
      .input("es", estado)
      .input("cap", max)
      .query(querys.getArea);
    
      if(action == 'L' || action == 'B'){
        return result.recordset;
      }else{
        var msj = "fields affected";
        return msj;
      }
  }
  catch (error) {
    console.error(error);
  }
};