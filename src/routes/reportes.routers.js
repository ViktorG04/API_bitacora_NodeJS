import { Router } from 'express';

import {
    getAllReportes, getAllSolicidByDate
} from '../controllers/reportes.controllers';

const router = Router();

//all
router.get("/reportes/visitas", getAllReportes);

//solicitudes by date
router.post("/reportes/solicituporfecha", getAllSolicidByDate)


export default router;