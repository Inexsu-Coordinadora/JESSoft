import Fastify from 'fastify';
import { registrarRutas } from './presentation/app';
import { configuracion } from './common/configuracion';

const app = Fastify({ logger: true });
registrarRutas(app);

app.listen({ port: configuracion.port, host: '0.0.0.0' });
