import { Router } from 'express';

import {
    getAllReportes, getAllReportesBydate, getAllSolicidByDate, getAllVisitasByArea, getAllAreaFech
} from '../controllers/reportes.controllers';

const router = Router();

//all
router.get("/reportes/visitas", getAllReportes);

//visitas por rango de fecha
router.post("/reportes/visitas/porfecha", getAllReportesBydate);

//todas las visitas por area
router.get("/reportes/visitas/:id", getAllVisitasByArea);

router.post("/reportes/area/fecha", getAllAreaFech);

//solicitudes by date
router.post("/reportes/solicituporfecha", getAllSolicidByDate);

export default router;