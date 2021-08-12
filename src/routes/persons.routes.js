import { Router } from 'express';

import {
    getPersons, getPersonById, getPersonsbyCompany
} from '../controllers/persons.controller';

const router = Router();

//all
router.get("/persons", getPersons);

//all person by company
router.get("/persons/company/:id", getPersonsbyCompany);

//only one
router.get("/persons/:id", getPersonById);

export default router;