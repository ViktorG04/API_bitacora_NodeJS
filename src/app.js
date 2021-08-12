import express from 'express';
import config from './config';

import userRoutes from './routes/users.router';
import personRoutes from './routes/persons.routes';
import companyRoutes from './routes/companies.route';

const app = express();
const raiz = "/api";

//settings
app.set('port', config.port)

//desde formularios
app.use(express.urlencoded({ extended: false }));

//Routes
app.use(raiz, userRoutes);
app.use(raiz, personRoutes);
app.use(raiz, companyRoutes);

export default app