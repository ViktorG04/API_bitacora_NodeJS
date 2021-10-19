import { getConnection, querys } from "../database";
import { fechFormat } from "./notificacion";
import moment from "moment";

//list incapacidad
export const getIncapacidades = async (req, res) =>{
    var result;

    result = await crupIncapacidad('L','','','','','')
    res.json(result);
};

//list incapacidad by employee
export const getIncapacidadByIdEmployee = async(req, res) =>{
    const id = req.params.id;
    var result;

    result = await crupIncapacidad('B', '', id, '', '', '');
    res.json(result);
}

//insert incapacidad
export const createNewIncapacidad = async (req, res) => {
    const { numIncapacidad, idEmpleado, fechaInicio, fechaFin, motivo } = req.body;

    var numIn, idEm, fInicio, fFin, result, days;
    
    numIn = parseInt(numIncapacidad);
    idEm = parseInt(idEmpleado);

    if (isNaN(numIn) || isNaN(idEm) || fechaInicio == " " || fechaFin == " " || motivo == " ") {
        return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
    }

    fInicio = await fechFormat(fechaInicio);
    fFin = await fechFormat(fechaFin);

    result = await crupIncapacidad('I',numIn, idEm, fInicio, fFin, motivo, 0);

    if (result == null) {
        return res.status(400).json({ msg: "Bad Request. Error! insert incapacidad" });
    }
    
    fInicio = moment(fInicio.split(" ")[0]);
    fFin = moment(fFin.split(" ")[0]);

    days = (fFin.diff(fInicio, 'days'));

    result = result+" usuario Inactivo durante " +days+" dias";
    
    res.json(result);
};


//consult in database
async function crupIncapacidad(action, incapacidad, empleado, fechaInicio, fechaFin, motivo) {
    try {
        const connection = await getConnection();
        const result = await connection
            .request()
            .input("A", action)
            .input("numI", incapacidad)
            .input("emp", empleado)
            .input("fechI", fechaInicio)
            .input("fechF", fechaFin)
            .input("mot", motivo)
            .query(querys.IIncapacidad);
        var msj;

        if(action !='I'){
            msj = result.recordset;
        }else{
            msj = "Incapacidad Creada!";
        }
        return msj;
    } catch (error) {
        console.error(error);
    }
};