import { Router } from 'express';

import {
    getTipEntity, getTipEntityById
} from '../controllers/tipEntity.controller';

const router = Router();

//all
router.get("/tipo", getTipEntity);

//only one
router.get("/tipo/:id", getTipEntityById);

export default router;