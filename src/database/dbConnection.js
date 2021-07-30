import sql from "mssql";
import config from '../config';

export const dbSettings = {
    user: config.dbUser,
    password: config.dbPassword,
    server: config.dbServer,
    database: config.dbDatabase,
    port: config.dbPort,
    options: {
        encrypt: true, // for azure
        trustServerCertificate: true, // change to true for local dev / self-signed certs
    },
};

export const getConnection = async () => {
    try {
        const connection = await sql.connect(dbSettings);
        return connection;
    } catch (error) {
        console.error(error);
    }
};

export { sql };