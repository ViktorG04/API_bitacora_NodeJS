import { Router } from 'express';

import {
 getSolicitudes, getSolicitudById, createNewSolicitudEmployee, createNewSolicitudVisitas, 
 createDetalleIngreso, updateStateSolicitud, updateValuesSolicitud
} from '../controllers/solicitud.controller';

const router = Router();

//all solicitudes
router.get("/solicitudes/empleado/:id", getSolicitudes);

//only one solicitud
router.get("/solicitudes/:id", getSolicitudById);

//insert solicitud 
router.post("/solicitudes/empleado", createNewSolicitudEmployee);

//insert solicitud for all people
router.post("/solicitudes/visitas", createNewSolicitudVisitas);

//insert detalleSolicitud
router.post("/solicitudes/ingreso", createDetalleIngreso);

//update state solicitud
router.put("/solicitudes/estado", updateStateSolicitud);

//update all data
router.put("/solicitudes", updateValuesSolicitud);


export default router;