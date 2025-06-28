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
    'https://webshoptesis.netlify.app'
];
const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => (0, cors_1.default)({
    origin: (origin, callback) => {
        if (acceptedOrigins.includes(origin))
            return callback(null, true);
        if (!origin)
            return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
});
exports.corsMiddleware = corsMiddleware;
//# sourceMappingURL=cors.js.map