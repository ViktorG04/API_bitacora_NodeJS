import { Router } from 'express';

import {
    getUserById
} from '../controllers/users.controller';

const router = Router();

//only one
router.get("/users/:id", getUserById);

export default router;