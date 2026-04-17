import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import logger from 'jet-logger';
import morgan from 'morgan';
import path from 'path';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import Paths from '@src/common/constants/Paths';
import { RouteError } from '@src/common/utils/route-errors';
import BaseRouter from '@src/routes/apiRouter';
import cors from 'cors';

import EnvVars, { NodeEnvs } from './common/constants/env';

/******************************************************************************
                                Setup
******************************************************************************/

const app = express();

// **** Middleware **** //

// Cors Configuration
const corsOptions = {
  origin: 'http://localhost:4200',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.DEV) {
  app.use(morgan('dev'));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.PRODUCTION) {
  // eslint-disable-next-line no-process-env
  if (!process.env.DISABLE_HELMET) {
    app.use(helmet());
  }
}

// Add APIs, must be after middleware
app.use(Paths._, BaseRouter);

app.use((req, res, next) => {
  console.log('Headers:', res.getHeaders());
  next();
});




// Add error handler
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (EnvVars.NodeEnv !== NodeEnvs.TEST.valueOf()) {
    logger.err(err, true);
  }
  let status: HttpStatusCodes = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
    res.status(status).json({ error: err.message });
  }
  return next(err);
});



// **** FrontEnd Content **** //

// Set views directory (html)
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);

// Set static directory (js and css).
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// Nav to users pg by default
app.get('/', (_: Request, res: Response) => {
  return res.redirect('/users');
});

// Redirect to login if not logged in.
app.get('/users', (_: Request, res: Response) => {
  return res.sendFile('users.html', { root: viewsDir });
});

/******************************************************************************
                                Export default
******************************************************************************/

export default app;
