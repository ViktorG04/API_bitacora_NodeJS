import express from 'express';
import cors from "cors";
import morgan from "morgan";

import config from './config';

import userRoutes from './routes/users.router';
import personRoutes from './routes/persons.routes';
import companyRoutes from './routes/companies.route';
import stateRoutes from './routes/states.routes';
import rolRoutes from './routes/roles.routes';
import areaRoutes from './routes/areas.routes';
import tipEntity from './routes/tipEntity.routes';

const app = express();
const raiz = "/api";

//settings
app.set('port', config.port)

//Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes
app.use(raiz, userRoutes);
app.use(raiz, personRoutes);
app.use(raiz, companyRoutes);
app.use(raiz, stateRoutes);
app.use(raiz, rolRoutes);
app.use(raiz, areaRoutes);
app.use(raiz, tipEntity);

export default app