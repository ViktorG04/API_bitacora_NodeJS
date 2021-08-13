import { Router } from 'express';

import {getCompanies, getCompanyByName, updateCompanyById
    } from '../controllers/companies.controller';

const router = Router();

//all
router.get("/companies", getCompanies);
router.put("/companies/:id", updateCompanyById);
router.get("/companies/name", getCompanyByName);


export default router;