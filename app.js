import express from 'express';
import { PORT } from './config/env.js';
import connectToDatabase from './database/mongodb.js';
import authRouter from './routes/auth.routes.js';
import searchRouter from './routes/search.route.js';
import jobRouter from './routes/job.routes.js';
import applicationRouter from './routes/application.routes.js';
import userRouter from './routes/user.routes.js';
import errorMiddleware from './middleware/error.middleware.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';



const app = express();

// Integrating middlewares
app.use(errorMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CORS middleware
app.use(cors({
  origin: 'http://127.0.0.1:3000', // or 'http://localhost:3000'
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.options('*', cors());


// Integrating routes
// I have to refine the  endpoints in future for better readability and maintainability
app.use('/api/v1/auth',authRouter);
app.use('/api/v1',searchRouter);
app.use('/api/v1',jobRouter);
app.use('/api/v1',applicationRouter);
app.use('/api/v1',userRouter)


app.get('/', (req, res) => {
  res.send('Hello World!');
}
);

app.listen(PORT, async() => {
  console.log('Server is running on http://localhost:' + PORT);
  // eslint-disable-next-line no-undef
  console.log('Environment: ' + process.env.NODE_ENV);
  await connectToDatabase();
}
);
// Export the app for testing
export default app;
