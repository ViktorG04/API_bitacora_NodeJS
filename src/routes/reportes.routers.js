import { Router } from 'express';

import {
    getAllReportes
} from '../controllers/reportes.controllers';

const router = Router();

//all
router.get("/reportes/visitas", getAllReportes);



export default router;