import { Router } from 'express';

import {createNewIncapacidad, getIncapacidades, getIncapacidadByIdEmployee} from '../controllers/incapacidad.controller';

const router = Router();

//list
router.get("/incapacidades", getIncapacidades);

//list by id employee
router.get("/incapacidades/:id", getIncapacidadByIdEmployee)

//insert 
router.post("/incapacidades", createNewIncapacidad);

export default router;