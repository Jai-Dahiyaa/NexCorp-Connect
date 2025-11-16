import dotenv from 'dotenv'
import './db/db.js';
import "./config/redis.js"
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { swaggerUi, swaggerSpec } from './config/swagger.js';
import errorMiddleware from './middleware/error.middleware.js';
import Routes from './routes/index.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorMiddleware);
app.use(cookieParser())
Routes(app)

app.get('/', (req, res) => {
  res.send('<h1>Server is running</h1>');
});

export default app;
