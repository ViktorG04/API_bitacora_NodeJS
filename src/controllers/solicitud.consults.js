import { getConnection, querys } from "../database";

//function consult solicitudes
export const searchSolicitud = async (id, action) => {
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
export const listSolicitudes = async (id, rol) => {
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
export const insertUpdateSolicitud = async (action, idUser, fecha, motivo, area, estado) => {
    try {
        const connection = await getConnection();
        const result = await connection
            .request()
            .input("A", action)
            .input("user", idUser)
            .input("fech", fecha)
            .input("mo", motivo)
            .input("area", area)
            .input("est", estado)
            .query(querys.postPutSolicitud);
        var msj
        if (action == 'U') {
            msj = "fields affected";
        }
        else if(action == 'I'){
            msj = result.recordset[0]["ID"];
        }else{
            msj = result.recordset[0]['total'];
        }
        return msj;
    } catch (error) {
        console.error(error);
    }
};

//function insert detalleSolicitud
export const addDetalleSolicitud = async (idSolicitud, idPerson) => {
    try {
        const connection = await getConnection();
        const result = await connection
            .request()
            .input("sol", idSolicitud)
            .input("per", idPerson)
            .query(querys.postDSolicitud);
        return result.recordset[0]["ID"];
    } catch (error) {
        console.error(error);
    }
};

//function create covid response requests
export const crupResFormulario = async (action, idDetaSolicitud, numPregunta, request) => {
    try {
        const connection = await getConnection();
        const result = await connection
            .request()
            .input("A", action)
            .input("detaS", idDetaSolicitud)
            .input("pre", numPregunta)
            .input("res", request)
            .query(querys.crupFormulario);
        return result.recordset;
    } catch (error) {
        console.error(error);
    }
};

//function update state of the solicitud
export const updateSolicitudState = async (solicitud, estado) => {
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
export const insertTempPerson = async (temperatura, detalle) => {
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

//request function data to take action
export const dataSolicitud = async (id, action) => {
    try {
        const connection = await getConnection();
        const result = await connection
            .request()
            .input("A", action)
            .input("id", id)
            .query(querys.getDataSolicitud);
        return result.recordset[0];
    } catch (error) {
        console.error(error);
    }
};

//capacity of an office
export const capacidadVisitas = async (action, estado, area, fecha, solicitud) => {
    try {
        const connection = await getConnection();
        const result = await connection
            .request()
            .input("A", action)
            .input("est", estado)
            .input("area", area)
            .input("fech", fecha)
            .input("id", solicitud)
            .query(querys.getCapacidad);
        return result.recordset[0];
    } catch (error) {
        console.error(error);
    }
};