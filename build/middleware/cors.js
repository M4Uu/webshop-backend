"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsMiddleware = void 0;
const cors_1 = __importDefault(require("cors"));
const ACCEPTED_ORIGINS = [
    'http://localhost:1234',
    'http://localhost:9876',
    'http://localhost:4200',
    'https://webshoptesis.netlify.app',
    'https://www.webshoptesis.netlify.app',
];
const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => (0, cors_1.default)({
    origin: (origin, callback) => {
        // 1. Permitir solicitudes sin 'Origin' (mismo origen, curl, etc.)
        if (!origin)
            return callback(null, true);
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
});
exports.corsMiddleware = corsMiddleware;
//# sourceMappingURL=cors.js.map