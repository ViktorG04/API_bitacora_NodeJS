import { Router } from 'express';

import {createNewIncapacidad} from '../controllers/incapacidad.controller';

const router = Router();

//insert 
router.post("/incapacidades", createNewIncapacidad);


export default router;