import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:1234',
  'http://localhost:9876',
  'http://localhost:4200',
  'https://webshoptesis.netlify.app'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin: string | undefined, callback) => {
    // 1. Permitir solicitudes sin 'Origin' (mismo origen, curl, etc.)
    if (!origin) return callback(null, true);

    // 2. Normalizar el origen para comparación
    const normalizedOrigin = origin.toLowerCase().replace(/\/$/, '');
    const normalizedAccepted = acceptedOrigins.map(o => o.toLowerCase().replace(/\/$/, ''));

    // 3. Verificar contra la lista de permitidos
    if (normalizedAccepted.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    // 4. Rechazar todos los demás orígenes
    return callback(new Error(`Origen '${origin}' no permitido por CORS`));
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
})