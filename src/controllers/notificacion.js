import axios from "axios";
import config from '../config';

export const sendEmailAppService = async(solicitud, correo, mensaje) =>{
    var data ={
        task: solicitud,
        due: mensaje,
        email: correo
    }
    console.log(data);
    try {
        const response = await axios.post(config.AppService, data);
        console.log("status send email "+response.status);
    } catch (error) {
        console.log(error);
    } 
};

//function format fech
export const fechFormat = async(fecha) =>{
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
        
        if( fecha[1] != null){
            nuevaFecha = nuevaFecha + fecha[1];
        }
        return nuevaFecha;
    } catch (error) {
        console.error(error);
    }
};