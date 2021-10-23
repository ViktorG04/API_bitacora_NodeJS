import { getConnection, querys } from "../database";
import { capacidadVisitas } from "./solicitud.consults";
import { fechFormat } from "./notificacion";

//all areas
export const getAreas = async (req, res) => {
  var result = await crupAreas(0, '', 'L', 0, 0);
  res.json(result);
};

//only area
export const getAreaById = async (req, res) => {
  var result = await crupAreas(req.params.id, '', 'B', '');
  res.json(result[0]);
};

//insert area
export const createNewArea = async (req, res) => {
  const { nombre, estado, capacidad } = req.body;
  var idE = parseInt(estado);
  var maxPeople = parseInt(capacidad);
  if (nombre == "" || isNaN(idE) || isNaN(maxPeople)) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }
  if (idE == 1 || idE == 2) {
    var result = await crupAreas(0, nombre, 'I', idE, maxPeople)
    res.json({ result });
  } else {
    return res.status(400).json({ msg: "Bad Request. Please estate active = 1 or inactive = 2" });
  }
};

//update area
export const updateAreaById = async (req, res) => {
  const { idArea, descripcion, estado, capacidad } = req.body;

  var idA, idE, maxPeople;
  idA = parseInt(idArea);
  idE = parseInt(estado);
  maxPeople = parseInt(capacidad);

  if (isNaN(idA) || isNaN(idE) || descripcion == "" || isNaN(maxPeople)) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }
  if (idE == 1 || idE == 2) {
    var result = await crupAreas(idA, descripcion, 'U', idE, maxPeople);
    res.json({ result });
  } else {
    return res.status(400).json({ msg: "Bad Request. Please estate active = 1 or inactive = 2" });
  }
};



export const getCapacity = async (req, res) => {

  const { fecha } = req.body;
  var fechaModificada, peopleApproved, peopleIngress, peopleLeft, result, id;

  fechaModificada = await fechFormat(fecha);
  fechaModificada = fechaModificada+'%'

  result = await crupAreas(0, '', 'L', 0, 0);

  for (const i in result) {
    delete result[i]['idEstado']

    id = result[i]['idArea']
    //people to enter on that date
    peopleApproved = await capacidadVisitas('S', 4, id, fechaModificada,0);
    //people inside the office
    peopleIngress = await capacidadVisitas('I', 6, id, fechaModificada,0);

    //people outside the office
    peopleLeft = await capacidadVisitas('S', 7, id, fechaModificada,0)
  
    result[i].Personas_SolicitudAprobada = peopleApproved['total'];
    result[i].Personas_en_sitio = peopleIngress['total'];
    result[i].Personas_ya_salieron = peopleLeft['total'];

  }
  res.json(result);
};




//function crup in database
async function crupAreas(id, area, action, estado, max) {
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
    if (action == 'L' || action == 'B' || action == 'T') {
      return result.recordset;
    } else {
      var msj = "fields affected";
      return msj;
    }
  }
  catch (error) {
    console.error(error);
  }
};