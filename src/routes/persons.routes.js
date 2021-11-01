import { Router } from 'express';

import {
    getPersons, getPersonById, getPersonsbyCompany, updatePersonById, getPeopleByCompany, 
    getValidateDui, updateStatePerson
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

//update status
router.put("/persons/state", updateStatePerson);

//validate doc identity
router.post("/persons/validate/dui", getValidateDui);

//search person by document
router.get("/persons/search/:id", getPeopleByCompany);

export default router;