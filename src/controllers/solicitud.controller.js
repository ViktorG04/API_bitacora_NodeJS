import { createNewPerson, detalleEmployee } from "./persons.controller";
import { createNewCompany } from "./companies.controller";
import { sendEmailAppService, fechFormat } from "./notificacion";
import {
    searchSolicitud,
    listSolicitudes,
    addSolicitud,
    addDetalleSolicitud,
    updateSolicitudState,
    insertTempPerson,
    dataSolicitud,
    capacidadVisitas
} from "./solicitud.consults";

//all solicitudes
export const getSolicitudes = async (req, res) => {
    var id = req.params.id;
    var allSolicitudes, idR;
    idR = await detalleEmployee(id, 'R');
    idR = idR['idRol'];
    allSolicitudes = await listSolicitudes(id, idR);

    if (idR == 4) {
        for (const i in allSolicitudes) {
            console.log(allSolicitudes[i]['estado']);
            if (allSolicitudes[i]['estado'] == "En Progreso") {
            }
            else if (allSolicitudes[i]['estado'] == "Aprobado") {
            }
            else {
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

    //get details solicitud
    resultSolicitud = await searchSolicitud(id, "BS");

    //get all people of solicitud
    resultDetalle = await searchSolicitud(id, "BD");

    //people who are inside
    resultIngreso = await searchSolicitud(id, "DI");
    if (resultIngreso.length > 0) {
        for (const i in resultDetalle) {
            for (const x in resultIngreso) {
                if (resultDetalle[i]["idDetalle"] == resultIngreso[x]['idDetalle']) {
                    resultDetalle[i].temperatura = resultIngreso[x]['temperatura'];
                    resultDetalle[i].horaIngreso = resultIngreso[x]['fechaHoraIngreso'];
                    resultDetalle[i].horaSalida = resultIngreso[x]['fechaHoraSalida'];
                };
            };
        };
    };

    resultSolicitud[0].empresa = resultDetalle[0]["empresa"];

    for (const i in resultDetalle) {
        delete resultDetalle[i]["empresa"];
    };

    resultSolicitud[0].personas = resultDetalle;

    //send json
    res.json(resultSolicitud[0]);
};

//add new solicitud bye employee
export const createNewSolicitudEmployee = async (req, res) => {
    const { idUsuario, fechayHoraVisita, motivo, idArea } = req.body;

    var idU = parseInt(idUsuario);
    var idA = parseInt(idArea);
    var idP, idS, fecha, resultDetalle, nombre;

    if (isNaN(idU) || isNaN(idA) || fechayHoraVisita == "" || motivo == "") {
        return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
    }

    //validation and format date
    fecha = await fechSolicitud(fechayHoraVisita);
    if (fecha == '0-00-0000') {
        return res.status(400).json({ msg: "Error with the time of solicitud" });
    }

    //add new solicitud
    idS = await addSolicitud(idU, fecha, motivo, idA);
    if (idS == null) {
        return res.status(400).json({ msg: "Bad Request. Error creating Solicitud" });
    }

    //get idperson of user
    idP = await detalleEmployee(idU, 'I');
    idP = idP['idPersona'];
    var idF = 1;

    //get name employee
    nombre = await detalleEmployee(idU, 'N');
    nombre = nombre['Nombre'];

    //add new detalleSolicitud
    resultDetalle = await addDetalleSolicitud(idS, idP, idF);

    //sen email to rrhh
    sendEmailRRHH(nombre, fechayHoraVisita, idS, "Creada!");

    res.json({ resultDetalle });
};

//add new solicitud for all people
export const createNewSolicitudVisitas = async (req, res) => {
    const { idUsuario, idEmpresa, empresa, fechayHoraVisita, motivo, idTipoEmpresa, idArea, personas } = req.body;
    var idU, idA, idEmp, idTip, idP, idS, fecha, resultDetalle, nombre;

    idU = parseInt(idUsuario);
    idA = parseInt(idArea);
    idEmp = parseInt(idEmpresa);
    idTip = parseInt(idTipoEmpresa);


    if (isNaN(idU) || isNaN(idEmp) || empresa == "" || fechayHoraVisita == "" || motivo == "" || isNaN(idTip) ||
        isNaN(idA) || personas.length == 0) {
        return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
    }

    if (personas.length > 5) {
        return res.status(400).json({ msg: "Bad Request. Please maximum 5 people" });
    }

    //validation and format date
    fecha = await fechSolicitud(fechayHoraVisita);
    if (fecha == '0-00-0000') {
        return res.status(400).json({ msg: "Error with the time of solicitud" });
    }

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

    //sen email to rrhh
    nombre = await detalleEmployee(idU, 'N');
    nombre = nombre['Nombre'];
    sendEmailRRHH(nombre, fechayHoraVisita, idS, "Creada!");

    res.json({ resultDetalle });
};

//insert temp of person
export const createDetalleIngreso = async (req, res) => {
    const { idSolicitud, personas } = req.body;

    var idS, idD, temp, resultDeIngreso, idEA, msj;
    var resultCreation = 0;

    idS = parseInt(idSolicitud);

    if (isNaN(idS) || personas.length == 0) {
        return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
    }

    for (const i in personas) {
        idD = parseInt(personas[i]["idDetalle"]);
        temp = parseFloat(personas[i]["temperatura"]);

        if (isNaN(idD) || isNaN(temp) || temp == 0) {
            return res.status(400).json({ msg: "Bad Request. Please fill all fields people" });
        }
        if (temp >= 37.00) {
            return res.status(400).json({ msg: "Bad Request. notify human resources temperature of idDetalle:" + idD + " above 37 °" });
        }
        //call function
        resultDeIngreso = await insertTempPerson(temp, idD);
        if (resultDeIngreso == 'OK') {
            resultCreation = resultCreation + 1;
        }
    };
    if (resultCreation != personas.length) {
        return res.status(400).json({ msg: "Bad Request. Error creating DetalleIngreso" });
    }

    idEA = await dataSolicitud(idS, 'ES');
    if (idEA['Actual'] == 4) {
        //solicitud status in progress
        updateSolicitudState(idS, 6);
    }
    msj = "fields affected";

    res.json({ msj });
};

//update state solicitud
export const updateStateSolicitud = async (req, res) => {
    const { idUsuario, idSolicitud, idEstado } = req.body;

    var idU, idR, idS, idNE, idEA, datos, resultState, capacidad;

    idU = parseInt(idUsuario);
    idS = parseInt(idSolicitud);
    idNE = parseInt(idEstado);

    if (isNaN(idU) || isNaN(idS) || isNaN(idNE) || idS == 0, idNE == 0) {
        return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
    }

    idEA = await dataSolicitud(idS, 'ES');
    idEA = idEA['Actual'];
    idR = await detalleEmployee(idU, 'R');
    idR = idR['idRol'];
    datos = await dataSolicitud(idS, 'DS');

    if (idNE == 8 & (idR == 1 || idR == 2 || idR == 3)) {
        if (idEA == 5 || idEA == 7 || idEA == 8) {
            return res.status(400).json({ msg: "error al cancelar solicitud" });
        }
        else if (idEA == 6) {
            return res.status(400).json({ msg: "error al cancelar solicitud status en progreso" });
        } else {
            resultState = await updateSolicitudState(idS, idNE);
            sendEmailRRHH(datos['nombreCompleto'], datos['fecha'], idS, "Cancelada");
            sendEmailEmployee(datos['correo'], datos['fecha'], idS, idNE);
        }
    } else if (idR == 1 & (idNE == 4 || idNE == 5)) {
        if (idEA == 3) {
            if (idNE == 4) {
                capacidad = await validarCapacidadVisitas(datos['fecha'], datos['idArea'], idNE, idS);
                if (capacidad.indexOf('!') >= 1) {
                    return res.status(400).json({ msg: capacidad});
                }
                resultState = await updateSolicitudState(idS, idNE);
                if(resultState == null){
                    return res.status(400).json({ msg: "error al actualizar estado a aprobado" });
                }
                sendEmailEmployee(datos['correo'], datos['fecha'], idS, idNE);
                resultState = capacidad;
            }else{
                resultState = await updateSolicitudState(idS, idNE);
                sendEmailEmployee(datos['correo'], datos['fecha'], idS, idNE);
            }
        } else {
            return res.status(400).json({ msg: "error no se puede Aprobar o Rechazar la solicitud actual" });
        }
    } else if (idNE == 7 & (idR == 1 || idR == 4)) {
        if (idEA == 6) {
            resultState = await updateSolicitudState(idS, idNE);
        }
        else {
            return res.status(400).json({ msg: "error no se puede dar por Finalizada la solicitud actual" });
        }
    } else {
        return res.status(400).json({ msg: "error tiene permisos para cambiar el estado de la solcitud actual" });
    }

    res.json({ resultState });
};

//validation date
async function fechSolicitud(fecha) {
    var fechaSQL, comparar;
    fecha = await fechFormat(fecha);
    fechaSQL = await dataSolicitud(0, 'TI');
    comparar = await fechFormat(fechaSQL['fecha']);
    
    if (fecha <= comparar) {
        fecha = "0-00-0000";
    }
    return fecha;
};

//send email to rrhh
async function sendEmailRRHH(nombre, fecha, solicitud, estado) {
    var rrhhh, msj;
    var v1 = "Solicitud";
    if (estado == "Creada!") {
        msj = "Hola Administrador, Queremos comentarle que " + nombre +
            " ha creado la solicitud N°" + solicitud + " para el ingreso a la oficina el dia " + fecha;
    } else {
        msj = "Hola Administrador, Queremos comentarle que " + nombre +
            " ha cancelado la solicitud N°" + solicitud + " para el ingreso a la oficina el dia " + fecha;
    }
    v1 = v1 + " " + estado;
    rrhhh = await detalleEmployee(0, 'U');
    for (const i in rrhhh) {
        sendEmailAppService(v1, rrhhh[i]['correo'], msj);
    };
};

//send email to employee
async function sendEmailEmployee(correo, fecha, solicitud, estado) {
    var msj;
    var v1 = "Solicitud";
    if (estado == 4) {
        estado = "Aprobada";
        msj = "Notificando que su solicitud N°" + solicitud + " Ha sido " + estado + " con exito para el dia " + fecha;

    } else if (estado == 5) {
        estado = "Rechazada"
        msj = "Notificando que su solicitud N°" + solicitud + " Ha sido " + estado + " para el dia " + fecha +
            " Favor contactar con personal de Recursos Humanos";

    } else {
        estado = "Cancelada";
        msj = "Notificando que su solicitud N°" + solicitud + " Ha sido " + estado + " para el dia " + fecha +
            " Cualquier consulta contacte con Recursos Humanos";
    }
    v1 = v1 + " " + estado;
    sendEmailAppService(v1, correo, msj);
};

async function validarCapacidadVisitas(fecha, area, estado, solicitud) {
    var resulTP, resultCA, ingressPeople,fecha, notificacion, totalP, nuevaC;

    fecha = await fechFormat(fecha);
    fecha = fecha.split(" ");
    fecha = fecha[0] + "%";

    resultCA = await capacidadVisitas('C', '', area, '');
    ingressPeople = await capacidadVisitas('P', '', '', '', solicitud);
    resulTP = await capacidadVisitas('S', estado, area, fecha);

    console.log("")

    totalP = resulTP['total'] + ingressPeople['total'];
    nuevaC = resultCA['capacidad'] - totalP;

    if ( totalP < resultCA['capacidad']) {
        notificacion = "Solicitud Aprobada, personas a ingresar para esa fecha son " +totalP+ " disponibilidad: " + nuevaC;
    }
    else {
        notificacion = "ERROR! la capacidad maxima para el ingreso a la oficina es: " + resultCA['capacidad']
            + " el total de personas actual aprobado a ingresar es de: " + resulTP['total']+" y la solicitud actual es de "+ingressPeople['total']
            +" personas";
    }
    return notificacion;
};