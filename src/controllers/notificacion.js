import { getConnection, querys } from "../database";
import axios from "axios";
import config from '../config';


export const sendEmailAppService = async(solicitud, correo, mensaje) =>{
    var status, statusText, server, method, date, fecha, time;
    var data ={
        task: solicitud,
        due: mensaje,
        email: correo
    }

    try {
        const response = await axios.post(config.AppService, data);
        console.log("status send email "+response.status);

    } catch (error) {
        if(error !== null){
            status = error.response['status'];
            statusText = error.response['statusText'];
            server = error.response['request']['host'];
            method = error.response['request']['method'];
            date = new Date( error.response['headers']['date']);
    
            fecha = date.toISOString().substr(0, 10);
            time = date.getHours() + ':' + date.getMinutes() + ':00';
            fecha = fecha+' '+time;
            
            logsCorreos('I',status, statusText, fecha, correo, server,method);
        }
    } 
};

//function format fech
export const fechFormat = async(fecha) =>{
    try {
        var nuevaFecha;
        fecha = fecha.split(" ");
        if (fecha[0].indexOf("/") >= 1) {
            nuevaFecha = fecha[0].split("/").reverse().join("-");
            nuevaFecha;
        }
        else {
            nuevaFecha = fecha[0].split("-").reverse().join("-");
            nuevaFecha;
        }
        
        if( fecha[1] != null){
            nuevaFecha = nuevaFecha+ " " + fecha[1];
        }
        return nuevaFecha;
    } catch (error) {
        console.error(error);
    }
};

async function logsCorreos(action, codigo, status, fecha, email, host, metodo) {
    try {
      const connection = await getConnection();
      const result = await connection
        .request()
        .input("A", action)
        .input("co", codigo)
        .input("status", status)
        .input("fech", fecha)
        .input("email", email)
        .input("hots", host)
        .input("method", metodo)
        .query(querys.crupLogicApp);
      return result.recordset;
    } catch (error) {
      console.error(error);
    }
  };