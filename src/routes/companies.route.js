import { Router } from 'express';

import {getCompanies, updateCompanyById, getCompanyById
    } from '../controllers/companies.controller';

const router = Router();

//all
router.get("/companies", getCompanies);
router.put("/companies", updateCompanyById);
router.get("/companies/:id", getCompanyById);


export default router;