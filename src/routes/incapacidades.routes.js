import { Router } from 'express';

import {createNewIncapacidad, getIncapacidades, getIncapacidadByIdEmployee, nexepidemiologicos} from '../controllers/incapacidad.controller';

const router = Router();

//list
router.get("/incapacidades", getIncapacidades);

//list by id employee
router.get("/incapacidades/:id", getIncapacidadByIdEmployee)

//insert 
router.post("/incapacidades", createNewIncapacidad);

router.get("/incapacidades/nexos/:id", nexepidemiologicos);

export default router;