
import { getConnection, querys } from "../database";
import { createNewPerson } from "./persons.controller";
import { createNewCompany } from "./companies.controller";

//all solicitudes
export const getSolicitudes = async (req, res) => {

    var allSolicitudes;
    allSolicitudes = await searchSolicitud(0, 'LS')
    //enviar json
    res.json(allSolicitudes);
};

//solicitud bye id
export const getSolicitudById = async (req, res) => {

    var id = req.params.id;
    var resultSolicitud;
    var resultDetalle;
    var mostrarDetalleSolicitud = {};

    //get details solicitud
    resultSolicitud = await searchSolicitud(id, 'BS');

    //get all people of solicitud
    resultDetalle = await searchSolicitud(id, 'BD');

    mostrarDetalleSolicitud = {
        idSolicitud: resultSolicitud[0]['idSolicitud'],
        solicitante: resultSolicitud[0]['nombreCompleto'],
        fechayHoraVisita: resultSolicitud[0]['fechaVisita'],
        empresa: resultDetalle[0]['empresa'],
        motivoVisita: resultSolicitud[0]['motivo'],
        areaIngresar: resultSolicitud[0]['Area'],
        idEstado: resultSolicitud[0]['idEstado'],
        estado: resultSolicitud[0]['estado'],
        personas: resultDetalle
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
        return res.status(400).json({ msg: "Bad Request. Error creating Solicitud" });
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

    if (isNaN(idU) || isNaN(idEmp) || empresa == "" || fechayHoraVisita == "" || motivo == "" || isNaN(idTip) || isNaN(idA) || personas.length == 0) {
        return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
    }

    fecha = await fechFormat(fechayHoraVisita);

    //add new solicitud
    idS = await addSolicitud(idUsuario, fecha, motivo, idArea);

    if (idEmp == 0) {
        //add new company
        idEmp = await createNewCompany(empresa, idTip);
    }

    for (const i in personas) {
        //add new person
        if (personas[i]['idPersona'] == 0) {
            idP = await createNewPerson(
                personas[i]['nombre'],
                personas[i]['dui'],
                idEmp);
        }
        else {
            idP = personas[i]['idPersona']
        }
        var idF = 1;
        //add new detalleSolicitud
        resultDetalle = await addDetalleSolicitud(idS, idP, idF);
    }
    res.json({ resultDetalle });
};

//function consult solicitudes
async function searchSolicitud(id, action) {
    try {
        const connection = await getConnection();
        const result = await connection
            .request()
            .input("id", id)
            .input("A", action)
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
        return result.recordset[0]['ID'];
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
        var R = result.recordset[0]['idPersona'];
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
        }
        else {
            nuevaFecha = fecha[0].split("-").reverse().join("-");
            nuevaFecha = nuevaFecha + " ";
        }
        nuevaFecha = nuevaFecha + fecha[1];
        return nuevaFecha;
    } catch (error) {
        console.error(error);
    }
}