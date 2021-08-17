import { Router } from 'express';

import {
    getUserById, createNewUser, updateUserById
} from '../controllers/users.controller';

import { getUserLogin } from '../controllers/login.controller';

const router = Router();

//only one
router.get("/users/:id", getUserById);

//new user
router.post("/users", createNewUser);

//update user
router.put("/users", updateUserById);

//only one
router.get("/login", getUserLogin);

export default router;