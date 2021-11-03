import { createNewPerson, detalleEmployee } from "./persons.controller";
import { createNewCompany } from "./companies.controller";
import { sendEmailAppService, fechFormat } from "./notificacion";
import {
    searchSolicitud,
    listSolicitudes,
    addDetalleSolicitud,
    crupResFormulario,
    updateSolicitudState,
    insertTempPerson,
    dataSolicitud,
    capacidadVisitas,
    insertUpdateSolicitud
} from "./solicitud.consults";

//all solicitudes
export const getSolicitudes = async (req, res) => {
    var id = req.params.id;
    var allSolicitudes, idR, solicitudes;
    idR = await detalleEmployee(id, 'R');
    idR = idR['idRol'];
    allSolicitudes = await listSolicitudes(id, idR);

    if (idR == 3) {
        for (const i in allSolicitudes) {

            if (allSolicitudes[i]['estado'] == "En Progreso") {
            }
            else if (allSolicitudes[i]['estado'] == "Aprobado") {
            }
            else {
                delete allSolicitudes[i];
            }
        }
    };
    solicitudes = allSolicitudes.filter(function (e) { return e != null; });

    //enviar json
    res.json(solicitudes);
};

//solicitud bye id
export const getSolicitudById = async (req, res) => {
    var id = req.params.id;
    var resultSolicitud, resultDetalle, resultIngreso, resultFormulario;

    //get details solicitud
    resultSolicitud = await searchSolicitud(id, "BS");

    if(resultSolicitud.length == 0){
        return res.status(400).json({ msg: "Error with id of the solicitud" });
    }

    //get all people of solicitud
    resultDetalle = await searchSolicitud(id, "BD");

    //people who are inside
    resultIngreso = await searchSolicitud(id, "DI");
    if (resultIngreso.length > 0) {
        for (const i in resultDetalle) {
            for (const x in resultIngreso) {
                if (resultDetalle[i]['idDetalle'] == resultIngreso[x]['idDetalle']) {
                    resultDetalle[i].temperatura = resultIngreso[x]['temperatura'];
                    resultDetalle[i].horaIngreso = resultIngreso[x]['fechaHoraIngreso'];
                    resultDetalle[i].horaSalida = resultIngreso[x]['fechaHoraSalida'];
                };
            };
        };
    };

    //add name company
    resultSolicitud[0].empresa = resultDetalle[0]['empresa'];

    //add answers
    for (const i in resultDetalle) {
        delete resultDetalle[i]['empresa'];
        resultFormulario = await crupResFormulario('B', resultDetalle[i]['idDetalle'], '', '');

            resultDetalle[i].sintomas = resultFormulario[0]['respuesta'];
            resultDetalle[i].diagnosticado = resultFormulario[1]['respuesta'];
            resultDetalle[i].covidFamiliar = resultFormulario[2]['respuesta'];
            resultDetalle[i].viajo = resultFormulario[3]['respuesta'];
        
    }

        resultSolicitud[0].personas = resultDetalle;

    //send json
    res.json(resultSolicitud[0]);
};

//add new solicitud bye employee
export const createNewSolicitudEmployee = async (req, res) => {
    const { idUsuario, fechayHoraVisita, motivo, idArea, sintomas, diagnosticado, covidFamiliar, viajo} = req.body;

    var idU = parseInt(idUsuario);
    var idA = parseInt(idArea);
    var idP, idS, fecha, idDetalle, nombre, idE, capacidad, resultFormulario, validate, fechalike;
    idE = 3;

    if (isNaN(idU) || isNaN(idA) || fechayHoraVisita == "" || motivo == "" || sintomas == "" || covidFamiliar == "" || diagnosticado == "" || viajo == "" ) {
        return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
    }
    
    //validation and format date
    fecha = await fechSolicitud(fechayHoraVisita);
    if (fecha == '0-00-0000') {
        return res.status(400).json({ msg: "FECHA Y HORA NO PUEDEN SER MENORES A LA ACTUAL" });
    }

    fechalike = fecha.split(" ");
    fechalike = fechalike[0]+'%'
   
    //validation if exist one request created for an employee in date and time of required
    validate = await insertUpdateSolicitud('C', idU,fechalike, '', '', '');
    console.log(validate);
    if(validate != 0){
        return res.status(400).json({ msg: "NO PUEDE CREAR UNA SOLICITUD PARA LA FECHA SELECCIONADA"+
        " YA TIENE UNA SOLICITUD CREADA" });
    }


    //validate capacity of an office for that day
    capacidad = await disponibilidadOficina('I',fecha, idA,'4',1)
    if (capacidad.indexOf('!') >= 1) {
        return res.status(400).json({ msg: capacidad });
    }

    //validate capacity of an office for that day
    capacidad = await disponibilidadOficina('I',fecha, idA,'4',1)
    if (capacidad.indexOf('!') >= 1) {
        return res.status(400).json({ msg: capacidad });
    }

    //add new solicitud
    idS = await insertUpdateSolicitud('I', idU, fecha, motivo, idA, idE);
    if (idS == null) {
        return res.status(400).json({ msg: "Bad Request. Error creating Solicitud" });
    }

    //get idperson of user
    idP = await detalleEmployee(idU, 'I');
    idP = idP['idPersona'];

    //get name employee
    nombre = await detalleEmployee(idU, 'N');
    nombre = nombre['nombre'];

    //add new detalleSolicitud
    idDetalle = await addDetalleSolicitud(idS, idP);

    //add request 
    resultFormulario = await insertRestFormulario(idDetalle, sintomas, diagnosticado, covidFamiliar, viajo);

    //sen email to rrhh
    sendEmailRRHH(nombre, fechayHoraVisita, idS, "Creada!");

    if (idDetalle == null & resultFormulario == null) {
        return res.status(400).json({ msg: "Bad Request. Error creating Solicitud" });
    }

    res.json(capacidad);
};

//add new solicitud for all people
export const createNewSolicitudVisitas = async (req, res) => {
    const { idUsuario, idEmpresa, empresa, fechayHoraVisita, motivo, idTipoEmpresa, idArea, personas} = req.body;

    var idU, idA, idEmp, idTip, idP, idS, fecha, idDetalle, nombre, idE, capacidad, insertFormulario;

    idU = parseInt(idUsuario);
    idA = parseInt(idArea);
    idEmp = parseInt(idEmpresa);
    idTip = parseInt(idTipoEmpresa);
    idE = 4;

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

    //validate capacity of an office for that day
    capacidad = await disponibilidadOficina('I', fecha, idA, idE, personas.length)
    if (capacidad.indexOf('!') >= 1) {
        return res.status(400).json({ msg: capacidad });
    }
    //add new solicitud
    idS = await insertUpdateSolicitud('I',idU, fecha, motivo, idA, idE);

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
        //add new detalleSolicitud
        idDetalle = await addDetalleSolicitud(idS, idP);

        insertFormulario = await insertRestFormulario(idDetalle, 'No', 'No', 'No', 'No');
    }

    if (idDetalle == null & insertFormulario == null) {
        return res.status(400).json({ msg: "Error with creating request" });
    }
    //sen email to rrhh
    nombre = await detalleEmployee(idU, 'N');
    nombre = nombre['nombre'];
    sendEmailRRHH(nombre, fechayHoraVisita, idS, "Creada!");

    res.json({ capacidad });
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

//update data solicitud
export const updateValuesSolicitud = async (req, res) =>{
    const {idSolicitud, fechaVisita, motivo, idArea} = req.body;

    var idS, idA, fecha, capacidad, ingressPeople, resultUpdate;

    idS = parseInt(idSolicitud);
    idA = parseInt(idArea);

    if(isNaN(idS) || isNaN(idA) || fechaVisita == "" || motivo == ""){
        return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
    }

    fecha = await fechSolicitud(fechaVisita);
    if (fecha == '0-00-0000') {
        return res.status(400).json({ msg: "Error with the time of solicitud" });
    }

    //total number of people in the request
    ingressPeople = await capacidadVisitas('P', '', '', '', idS);

    //validate capacity of an office for that day
    capacidad = await disponibilidadOficina('U', fecha, idA,'4', ingressPeople['total'])
    if (capacidad.indexOf('!') >= 1) {
        return res.status(400).json({ msg: capacidad });
    }
    
    resultUpdate = await insertUpdateSolicitud('U',0, fecha, motivo, idA, idS)

    if(resultUpdate == null){
        return res.status(400).json({ msg: "Error updating of solicitud" });
    }

    res.json(capacidad);
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

    if (idNE == 8 & (idR == 1 || idR == 2)) {
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
                    return res.status(400).json({ msg: capacidad });
                }
                resultState = await updateSolicitudState(idS, idNE);
                if (resultState == null) {
                    return res.status(400).json({ msg: "error al actualizar estado a aprobado" });
                }
                sendEmailEmployee(datos['correo'], datos['fecha'], idS, idNE);
                resultState = capacidad;
            } else {
                resultState = await updateSolicitudState(idS, idNE);
                sendEmailEmployee(datos['correo'], datos['fecha'], idS, idNE);
            }
        } else {
            return res.status(400).json({ msg: "error no se puede Aprobar o Rechazar la solicitud actual" });
        }
    } else if (idNE == 7 & (idR == 1 || idR == 3)) {
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

//insert formulario
async function insertRestFormulario( detalleSolicitud , pre1, pre2, pre3, pre4){
    var insertFormulario;

    insertFormulario = await crupResFormulario('I', detalleSolicitud, 1, pre1);
    insertFormulario = await crupResFormulario('I', detalleSolicitud, 2, pre2);
    insertFormulario = await crupResFormulario('I', detalleSolicitud, 3, pre3);
    insertFormulario = await crupResFormulario('I', detalleSolicitud, 4, pre4);

    return insertFormulario;
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

//al momento de aceptar estado
async function validarCapacidadVisitas(fecha, area, estado, solicitud) {
    var resulTP, resultCA, resultTPA, ingressPeople, fecha, notificacion, totalP, nuevaC;

    fecha = await fechFormat(fecha);
    fecha = fecha.split(" ");
    fecha = fecha[0] + "%";

    resultCA = await capacidadVisitas('C', '', area, '');
    ingressPeople = await capacidadVisitas('P', '', '', '', solicitud);
    resulTP = await capacidadVisitas('S', estado, area, fecha);
    resultTPA = await capacidadVisitas('I', 6, area, fecha);

    totalP = resulTP['total'] + ingressPeople['total'] + resultTPA['total'];
    nuevaC = resultCA['capacidad'] - totalP;

    if (totalP < resultCA['capacidad']) {
        notificacion = "Solicitud Aprobada, personas posibles a ingresar " + ingressPeople['total'] +
            " personas dentro de la oficina " + resultTPA['total'] + " disponibilidad actual " + nuevaC;
    }
    else {
        notificacion = "ERROR! la capacidad maxima para el ingreso a la oficina es: " + resultCA['capacidad'] +
            " el total de personas actual aprobado a ingresar es de: " + resulTP['total'] +
            " el total de personas dentro de la oficina es de " + resultTPA['total'] +
            " y la solicitud actual es de " + ingressPeople['total'] + " personas";
    }
    return notificacion;
};

//disponibilidad antes de crear solicitud de visitas y ser aprobada
async function disponibilidadOficina(action, fecha, area, estado, personas) {
    var resulTP, resultCA, resultTPA, notificacion, solicitud, totalP, nuevaC;
    fecha = fecha.split(" ")[0] + "%";

    //capacity by office
    resultCA = await capacidadVisitas('C', '', area, '');

    //people to enter on that date
    resulTP = await capacidadVisitas('S', estado, area, fecha);

    //people inside the office
    resultTPA = await capacidadVisitas('I', 6, area, fecha);

    totalP = resulTP['total'] + resultTPA['total'] + personas;
    nuevaC = resultCA['capacidad'] - totalP;

    if (totalP < resultCA['capacidad']) {
     
        if(action != 'I'){
            solicitud = "Solicitud Actualizada ";
        }else{
            solicitud = "Solicitud Creada "; 
        }

        notificacion = solicitud+"personas posibles a ingresar " + personas +
        " personas dentro de la oficina " + resultTPA['total'] + " disponibilidad actual " + nuevaC;
    }
    else {
        notificacion = "ERROR! la capacidad maxima para el ingreso a la oficina es: " + resultCA['capacidad']
            + " el total de personas actual aprobado a ingresar es de: " + resulTP['total'] + " y la solicitud actual es de " + personas
            + " personas a ingresar";
    }
    return notificacion;
};