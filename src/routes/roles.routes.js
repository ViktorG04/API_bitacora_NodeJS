import { Router } from 'express';

import {
    getRoles, getRolById, updateRolById
} from '../controllers/roles.controller';

const router = Router();

//all
router.get("/roles", getRoles);

//only one
router.get("/roles/:id", getRolById);

//update
router.put("/roles", updateRolById);

export default router;