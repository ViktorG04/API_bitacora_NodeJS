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