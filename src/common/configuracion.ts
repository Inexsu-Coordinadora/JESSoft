import dotenv from 'dotenv';

dotenv.config();

export const config = {
    puerto: Number(process.env.PUERTO) || 3000,
    pg: {
        host: process.env.PGHOST,
        port: Number(process.env.PGPORT) || 5432,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDBNAME,
        ssl: process.env.PGSSLMODE === 'enable'
    }
};