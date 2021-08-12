import { Router } from 'express';

import {get, getCompanies
    } from '../controllers/companies.controller';

const router = Router();

//all
router.get("/companies", getCompanies);

export default router;