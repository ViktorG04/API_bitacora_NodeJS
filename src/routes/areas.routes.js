import { Router } from 'express';

import {
    getAreas, getAreaById, createNewArea, updateAreaById, getCapacity
} from '../controllers/areas.controller';

const router = Router();

//all
router.get("/areas", getAreas);

//only one
router.get("/areas/:id", getAreaById);

//insert 
router.post("/areas", createNewArea);

//update
router.put("/areas", updateAreaById);

//capacity in areas
router.post("/areas/reportes", getCapacity);

export default router;