import { Router } from 'express';

import {
    getStates, getStateById
} from '../controllers/states.controller';

const router = Router();

//all
router.get("/states", getStates);

//only one
router.get("/states/:id", getStateById);

export default router;