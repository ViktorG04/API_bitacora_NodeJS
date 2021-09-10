import { getConnection, querys } from "../database";
import { createNewPerson } from "./persons.controller";
import { createNewCompany } from "./companies.controller";

//all solicitudes
export const getSolicitudes = async (req, res) => {
    var id = req.params.id;
    var allSolicitudes, idR;
    idR = await detalleEmployee(id, 'R');
    idR = idR['idRol'];
    allSolicitudes = await listSolicitudes(id, idR);

    if(idR == 4){
        for(const i in allSolicitudes){
            console.log(allSolicitudes[i]['estado']);
            if(allSolicitudes[i]['estado'] == "En Progreso"){
            }
            else if(allSolicitudes[i]['estado'] == "Aprobado"){
            }
            else{
                delete allSolicitudes[i];
            }
        }
    };

    //enviar json
    res.json(allSolicitudes);
};

//solicitud bye id
export const getSolicitudById = async (req, res) => {
    var id = req.params.id;
    var resultSolicitud, resultDetalle, resultIngreso;
    var persona = {};
    var allpersonas = [];

    //get all people of solicitud
    resultDetalle = await searchSolicitud(id, "BD");
    for (const i in resultDetalle) {
        persona = {
            idDetalle: resultDetalle[i]['idDetalle'],
            nombre: resultDetalle[i]['nombreCompleto'],
            dui: resultDetalle[i]['docIdentidad']
        };
        allpersonas.push(persona);
    };

    //get all details ingreso
    resultIngreso = await searchSolicitud(id, "DI");
    if (resultIngreso.length > 0) {
        for (const i in allpersonas) {
            for (const x in resultIngreso) {
                if (allpersonas[i]["idDetalle"] == resultIngreso[x]['idDetalle']) {
                    allpersonas[i].temperatura = resultIngreso[x]['temperatura'];
                    allpersonas[i].horaIngreso = resultIngreso[x]['fechaHoraIngreso'];
                    allpersonas[i].horaSalida = resultIngreso[x]['fechaHoraSalida'];
                };
            };
        };
    };

    //get details solicitud
    resultSolicitud = await searchSolicitud(id, "BS");
    resultSolicitud[0].empresa = resultDetalle[0]["empresa"];
    resultSolicitud[0].personas = allpersonas;

    //send json
    res.json(resultSolicitud[0]);
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
    idP = await detalleEmployee(idU, 'I');
    idP = idP['idPersona'];
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

    if (personas.length > 5) {
        return res.status(400).json({ msg: "Bad Request. Please maximum 5 people" });
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

    var idS, idD, temp, resultState, resultDeIngreso, resultCreation, idEA, msj;

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
            resultCreation = resultCreation + i;
        }
    };

    if (resultCreation != personas.length) {
        return res.status(400).json({ msg: "Bad Request. Error creating DetalleIngreso" });
    }

    idEA = await searchSolicitud(idS, 'ES');
    if (idEA[0]['Actual'] == 3) {
        //solicitud status in progress
        resultState = await updateSolicitudState(idS, 6);
    }
    msj = "fields affected";

    res.json({ msj });
};

//update state solicitud
export const updateSolicitud = async (req, res) => {
    const { idSolicitud, idEstado } = req.body;

    var idS, idNE, idEA;
    idS = parseInt(idSolicitud);
    idNE = parseInt(idEstado);

    if (isNaN(idS) || isNaN(idNE) || idS == 0, idNE == 0) {
        return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
    }

    idEA = await searchSolicitud(idS, 'ES');
    idEA = idEA[0]['Actual'];


};

//function consult solicitudes
async function searchSolicitud(id, action) {
    try {
        const connection = await getConnection();
        const result = await connection
            .request()
            .input("A", action)
            .input("id", id)
            .query(querys.getDetalleSolicitud);
        return result.recordset;
    } catch (error) {
        console.error(error);
    }
};

//function list solicitudes
async function listSolicitudes(id, rol) {
    try {
        const connection = await getConnection();
        const result = await connection
            .request()
            .input("id", id)
            .input("rol", rol)
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
async function detalleEmployee(id, action) {
    try {
        const connection = await getConnection();
        const result = await connection
            .request()
            .input("A", action)
            .input("var", id)
            .query(querys.validatePerson);
        var R = result.recordset[0];
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
};

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