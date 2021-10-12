import { getConnection, querys } from "../database";
import { fechFormat } from "./notificacion";
import { detalleEmployee } from "./persons.controller";
import moment from "moment";

//insert incapacidad
export const createNewIncapacidad = async (req, res) => {
    const { numIncapacidad, idEmpleado, fechaInicio, fechaFin, motivo } = req.body;

    var numIn, idEm, fInicio, fFin, result, days, result15days, idP, person;
    var nexos = [];
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

    idP = await detalleEmployee(idEm, 'I');
    idP = idP['idPersona'];

    //entry of people after 15 days
    result15days = await getNextEpidemiological(fInicio);

    for(const i in result15days){

        if (result15days[i]['idPersona'] == idP){
             person = result15days[i];    

        }
        if(result15days[i]['Area'] == person['Area'] & result15days[i]['fecha'] == person['fecha']){
            nexos.push(result15days[i]);
        }
    }
    
    fInicio = moment(fInicio.split(" ")[0]);
    fFin = moment(fFin.split(" ")[0]);

    days = (fFin.diff(fInicio, 'days'));

    nexos =  " usuario Inactivo durante " +days+" dias" + nexos ;
    
    res.json(nexos);
};


async function crupIncapacidad(action, incapacidad, empleado, fechaInicio, fechaFin, motivo, id) {
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
            .input("id", id)
            .query(querys.IIncapacidad);
        var msj = "Incapacidad Creada!";
        return msj;
    } catch (error) {
        console.error(error);
    }

};

async function getNextEpidemiological(fecha){
    try {
        const connection = await getConnection();
        const result = await connection
            .request()
            .input("fech", fecha)
            .query(querys.getNexEpidemiological);
            return result.recordset;
    } catch (error) {
        console.error(error);
    }
}
