import { getConnection, querys } from "../database";
import { createNewPerson } from "./persons.controller";
import { createNewCompany } from "./companies.controller";

//all solicitudes
export const getSolicitudes = async (req, res) => {
    var allSolicitudes;
    allSolicitudes = await searchSolicitud(0, "LS", 0);
    //enviar json
    res.json(allSolicitudes);
};

//solicitud bye id
export const getSolicitudById = async (req, res) => {
    var id = req.params.id;
    var resultSolicitud, resultDetalle, mostrarFecha;
    var mostrarDetalleSolicitud, persona, detalle, datos = {};
    var allpersonas = [];

    //get details solicitud
    resultSolicitud = await searchSolicitud(id, "BS", 0);
    var idE = resultSolicitud[0]["idEstado"];

    //get all people of solicitud
    resultDetalle = await searchSolicitud(id, "BD", idE);

    for (const i in resultDetalle) {

        persona = {
            idDetalle: resultDetalle[i]['idDetalle'],
            nombre: resultDetalle[i]['nombreCompleto'],
            dui: resultDetalle[i]['docIdentidad']
        };
        if(resultDetalle[i]['temperatura']){
            persona.push({
                temperatura: resultDetalle[i]['temperatura'],
                horaIngreso: resultDetalle[i]['fechaHoraIngreso'],
                horaSalida: resultDetalle[i]['fechaHoraSalida']
            });
          
        }
        allpersonas.push(persona);
    };
    
    mostrarDetalleSolicitud = {
        idSolicitud: resultSolicitud[0]["idSolicitud"],
        solicitante: resultSolicitud[0]["nombreCompleto"],
        fechayHoraVisita: resultSolicitud[0]["fechaVisita"],
        empresa: resultDetalle[0]["empresa"],
        motivoVisita: resultSolicitud[0]["motivo"],
        areaIngresar: resultSolicitud[0]["Area"],
        idEstado: idE,
        estado: resultSolicitud[0]["estado"],
        personas: allpersonas,
    };

    //send json
    res.json(mostrarDetalleSolicitud);
};

//add new solicitud bye employee
export const createNewSolicitudEmployee = async (req, res) => {
    const { idUsuario, nombreCompleto, fechayHoraVisita, motivo, idArea } = req.body;

    var idU = parseInt(idUsuario);
    var idA = parseInt(idArea);
    var idP, idS, fecha, resultDetalle;

    if (isNaN(idU) || isNaN(idA) || nombreCompleto == "" || fechayHoraVisita == "" || motivo == "") {
        return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
    }

    fecha = await fechFormat(fechayHoraVisita);

    //add new solicitud
    idS = await addSolicitud(idU, fecha, motivo, idA);
    if (idS == null) {
        return res
            .status(400)
            .json({ msg: "Bad Request. Error creating Solicitud" });
    }
    //get idperson of user
    idP = await idPerson(idU);

    var idF = 1;
    //add new detalleSolicitud
    resultDetalle = await addDetalleSolicitud(idS, idP, idF);
    res.json({ resultDetalle });
};

//add new solicitud for all people
export const createNewSolicitudVisitas = async (req, res) => {
    const { idUsuario, idEmpresa, empresa, fechayHoraVisita, motivo, idTipoEmpresa, idArea, personas } = req.body;

    var idU = parseInt(idUsuario);
    var idA = parseInt(idArea);
    var idEmp = parseInt(idEmpresa);
    var idTip = parseInt(idTipoEmpresa);
    var idP, idS, fecha, resultDetalle;

    if (isNaN(idU) || isNaN(idEmp) || empresa == "" || fechayHoraVisita == "" || motivo == "" || isNaN(idTip) ||
        isNaN(idA) || personas.length == 0) {
        return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
    }

    fecha = await fechFormat(fechayHoraVisita);

    //add new solicitud
    idS = await addSolicitud(idU, fecha, motivo, idA);

    if (idEmp == 0) {
        //add new company
        idEmp = await createNewCompany(empresa, idTip);
    }

    for (const i in personas) {
        //add new person
        if (personas[i]["idPersona"] == 0) {
            idP = await createNewPerson(
                personas[i]["nombre"],
                personas[i]["dui"],
                idEmp
            );
        } else {
            idP = personas[i]["idPersona"];
        }
        var idF = 1;
        //add new detalleSolicitud
        resultDetalle = await addDetalleSolicitud(idS, idP, idF);
    }
    res.json({ resultDetalle });
};

//insert temp of person
export const createDetalleIngreso = async (req, res) => {
    const { idSolicitud, personas } = req.body;

    var idS, idD, temp, resultState, resultDeIngreso;
    var resultCreation = [];

    idS = parseInt(idSolicitud);

    if (isNaN(idS) || personas.length == 0) {
        return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
    }

    for (const i in personas) {
        idD = parseInt(personas[i]["idDetalle"]);
        temp = parseFloat(personas[i]["temperatura"]);

        if (isNaN(idD) || isNaN(temp) || temp == 0) {
            return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
        }

        //call function
        resultDeIngreso = await insertTempPerson(temp, idD);
        if (resultDeIngreso == 'OK') {
            resultCreation.push(i);
        }
    };
    if (resultCreation.length != personas.length) {
        return res.status(400).json({ msg: "Bad Request. Error creating DetalleIngreso" });
    }

    //solicitud status in progress
    resultState = await updateSolicitudState(idS, 6);

    res.json({ resultState });
};

//function consult solicitudes
async function searchSolicitud(id, action, A) {
    try {
        const connection = await getConnection();
        const result = await connection
            .request()
            .input("id", id)
            .input("A", action)
            .input("es", A)
            .query(querys.listSolicitudes);
        return result.recordset;
    } catch (error) {
        console.error(error);
    }
};

//function insert solicitud
async function addSolicitud(idUser, fecha, motivo, area) {
    try {
        const connection = await getConnection();
        const result = await connection
            .request()
            .input("user", idUser)
            .input("fech", fecha)
            .input("mo", motivo)
            .input("area", area)
            .query(querys.postSolicitud);
        return result.recordset[0]["ID"];
    } catch (error) {
        console.error(error);
    }
};

//function insert detalleSolicitud
async function addDetalleSolicitud(idSolicitud, idPerson, idForm) {
    try {
        const connection = await getConnection();
        await connection
            .request()
            .input("sol", idSolicitud)
            .input("per", idPerson)
            .input("idf", idForm)
            .query(querys.postDSolicitud);
        var msg = "fields affected";
        return msg;
    } catch (error) {
        console.error(error);
    }
};

//search idPerson
async function idPerson(id) {
    try {
        const connection = await getConnection();
        const result = await connection
            .request()
            .input("A", "I")
            .input("var", id)
            .query(querys.validatePerson);
        var R = result.recordset[0]["idPersona"];
        return R;
    } catch (error) {
        console.error(error);
    }
};

//function format fech
async function fechFormat(fecha) {
    try {
        var nuevaFecha;
        fecha = fecha.split(" ");
        if (fecha[0].indexOf("/") >= 1) {
            nuevaFecha = fecha[0].split("/").reverse().join("-");
            nuevaFecha = nuevaFecha + " ";
        } else {
            nuevaFecha = fecha[0].split("-").reverse().join("-");
            nuevaFecha = nuevaFecha + " ";
        }
        nuevaFecha = nuevaFecha + fecha[1];
        return nuevaFecha;
    } catch (error) {
        console.error(error);
    }
};

async function fechIngreso(fecha){
    var nuevaFecha;
    fecha = fecha.split("T");
    console.log(fecha);
}

//function update state of the solicitud
async function updateSolicitudState(solicitud, estado) {
    try {
        const connection = await getConnection();
        await connection
            .request()
            .input("id", solicitud)
            .input("est", estado)
            .query(querys.getSolicitud);
        var msg = "fields affected";
        return msg;
    } catch (error) {
        console.error(error);
    }
};

//function insert temperatura of the people
async function insertTempPerson(temperatura, detalle) {
    try {
        const connection = await getConnection();
        await connection
            .request()
            .input("temp", temperatura)
            .input("idDP", detalle)
            .query(querys.postDIngreso);
        var msg = "OK";
        return msg;
    } catch (error) {
        console.error(error);
    }
};