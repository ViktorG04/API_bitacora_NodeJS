import { Router } from 'express';

import {
 getSolicitudes, getSolicitudById
} from '../controllers/solicitud.controller';

const router = Router();

//all solicitudes
router.get("/solicitudes", getSolicitudes);

//only one solicitud
router.get("/solicitudes/:id", getSolicitudById);


export default router;