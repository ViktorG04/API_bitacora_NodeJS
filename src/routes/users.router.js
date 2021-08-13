import { Router } from 'express';

import {
    getUserById, createNewUser
} from '../controllers/users.controller';

const router = Router();

//only one
router.get("/users/:id", getUserById);

//new user
router.post("/users", createNewUser);

export default router;