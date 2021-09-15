import { getConnection, querys } from "../database";

//function consult solicitudes
export const searchSolicitud = async(id, action) =>{
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
export const listSolicitudes = async(id, rol) =>{
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
export const addSolicitud = async(idUser, fecha, motivo, area) =>{
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
export const addDetalleSolicitud = async(idSolicitud, idPerson, idForm) =>{
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
export const detalleEmployee = async(id, action) =>{
    try {
        const connection = await getConnection();
        const result = await connection
            .request()
            .input("A", action)
            .input("id", id)
            .query(querys.getDataEmployee);
        var R 
        if(action !='U'){
            R = result.recordset[0];
        }
        else{
            R = result.recordset;
        }
        return R;
    } catch (error) {
        console.error(error);
    }
};

//function update state of the solicitud
export const updateSolicitudState = async(solicitud, estado) =>{
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
export const insertTempPerson = async(temperatura, detalle) =>{
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
export const dataSolicitud = async(id, action) =>{
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