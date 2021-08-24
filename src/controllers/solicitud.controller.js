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
    try {
        const connection = await getConnection();
        const result = await connection
            .request()
            .input("id", req.params.id)
            .input("A", "BS")
            .query(querys.listSolicitudes);
        res.json(result.recordset[0]);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}