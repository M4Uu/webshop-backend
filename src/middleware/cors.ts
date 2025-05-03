import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:1234',
  'http://localhost:9876',
  'http://localhost:4200',
  'https://webshoptesis.netlify.app'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin: string | undefined, callback: (arg0: Error | null, arg1?: boolean) => void) => {
    if(acceptedOrigins.includes(origin as string)) return callback(null,true);
    if(!origin) return callback(null, true)
    return callback(new Error("Not allowed by CORS"))
  },
  methods: ['GET', 'POST', 'PATCH' ],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
})