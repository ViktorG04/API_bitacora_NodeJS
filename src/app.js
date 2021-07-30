import express from 'express';
import config from './config';

import userRoutes from './routes/users.router';

const app = express();

//settings
app.set('port', config.port)

//desde formularios
app.use(express.urlencoded({ extended: false }));

//Routes
app.use("/api", userRoutes);
export default app