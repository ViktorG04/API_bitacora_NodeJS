import { Router } from 'express';

import { createNewUser, updateUserById, getUsers
} from '../controllers/users.controller';

import { getUserLogin } from '../controllers/login.controller';

const router = Router();

//list users
router.get("/users/incapacidad", getUsers);

//new user
router.post("/users", createNewUser);

//update user
router.put("/users", updateUserById);

//login
router.post("/login", getUserLogin);

export default router;