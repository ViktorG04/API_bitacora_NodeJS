import { getConnection, querys } from "../database";

//all solicitudes
export const getSolicitudes = async (req, res) => {
    try {

        const connection = await getConnection();
        const result = await connection.request()
            .input("id", 0)
            .input("A", "LS")
            .query(querys.listSolicitudes);
        res.json(result.recordset);

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

//solicitud bye id
export const getSolicitudById = async (req, res) => {

    var id = req.params.id;
    var resultSolicitud;
    var resultDetalle;
    var mostrarDetalleSolicitud = {};

    resultSolicitud = await searchSolicitud(id, 'BS');

    resultDetalle = await searchSolicitud(id, 'BD');


    mostrarDetalleSolicitud = {
        idSolicitud: resultSolicitud[0]['idSolicitud'],
        solicitante: resultSolicitud[0]['nombreCompleto'],
        fechayHoraVisita: resultSolicitud[0]['fechayHoraVisita'],
        empresa: resultDetalle[0]['nombre'],
        motivoVisita: resultSolicitud[0]['motivo'],
        areaIngresar: resultSolicitud[0]['Area'],
        idEstado: resultSolicitud[0]['idEstado'],
        estado: resultSolicitud[0]['estado'],
        personas: resultDetalle
    };

    //enviar json
    res.json(mostrarDetalleSolicitud);
};


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
        error.message;
    }
};