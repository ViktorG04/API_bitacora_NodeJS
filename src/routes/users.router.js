import { Router } from 'express';

import {getUsers,
    getUserById
    } from '../controllers/users.controller';

const router = Router();

//all
router.get("/users", getUsers);

//only one
router.get("/users/:id", getUserById);

export default router;