import { Router } from 'express';

import {
 getSolicitudes, getSolicitudById, createNewSolicitudEmployee, createNewSolicitudVisitas, createDetalleIngreso, updateSolicitud
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
export default router;

//insert detalleSolicitud
router.post("/solicitudes/ingreso", createDetalleIngreso);

//update state solicitud
router.put("/solicitudes/estado", updateSolicitud);