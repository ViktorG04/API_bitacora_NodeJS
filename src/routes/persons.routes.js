import { Router } from 'express';

import {
    getPersons, getPersonById, getPersonsbyCompany, updatePersonById, getPersonByName, getValidateDui
} from '../controllers/persons.controller';

const router = Router();

//all
router.get("/persons", getPersons);

//all person by company
router.get("/persons/byIdCompany/:id", getPersonsbyCompany);

//only one
router.get("/persons/:id", getPersonById);

//update penson
router.put("/persons", updatePersonById);

//validate doc identity
router.post("/persons/validate/dui", getValidateDui);

//search person by document
router.post("/persons/validate/name", getPersonByName);

export default router;