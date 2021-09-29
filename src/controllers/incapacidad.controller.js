import { getConnection, querys } from "../database";
import { fechFormat } from "./notificacion";
import moment from "moment";

//insert incapacidad
export const createNewIncapacidad = async (req, res) => {
    const { idUsuario, idEmpleado, fechaInicio, fechaFin, motivo } = req.body;

    var idRH, idEm, fInicio, fFin, idEs, result, dias;
    idEs = 1;
    idRH = parseInt(idUsuario);
    idEm = parseInt(idEmpleado);

    if (isNaN(idRH) || isNaN(idEm) || fechaInicio == " " || fechaFin == " " || motivo == " ") {
        return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
    }

    fInicio = await fechFormat(fechaInicio);
    fFin = await fechFormat(fechaFin);

    result = await crupIncapacidad(idRH, idEm, fInicio, fFin, motivo, idEs);

    if (result == null) {
        return res.status(400).json({ msg: "Bad Request. Error! insert incapacidad" });
    }
    
    fInicio = moment(fInicio.split(" ")[0]);
    fFin = moment(fFin.split(" ")[0]);

    dias = (fInicio.diff(fFin, 'days'));
    console.log(dias);

    result = result + " usuario bloqueado durante " + dias+" dias";
    res.json(result);
};


async function crupIncapacidad(RRHH, empleado, fechaInicio, fechaFin, motivo, estado) {
    try {
        const connection = await getConnection();
        const result = await connection
            .request()
            .input("rh", RRHH)
            .input("emp", empleado)
            .input("fechI", fechaInicio)
            .input("fechF", fechaFin)
            .input("est", estado)
            .input("mot", motivo)
            .query(querys.IIncapacidad);
        var msj = "Incapacidad Creada!";
        return msj;
    } catch (error) {
        console.error(error);
    }

};
