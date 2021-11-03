import { Router } from 'express';

import { createNewUser, updateUserById, getUsers, updatePasswordById
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

//change password
router.put("/users/password", updatePasswordById);

export default router;