import logger from 'jet-logger';

import EnvVars from './common/constants/env';
import server from './server';
import { connectDB } from './db/database';
import { runMigrations } from './db/migration';

/******************************************************************************
                                Constants
******************************************************************************/

const SERVER_START_MESSAGE =
  'Express server started on port: ' + EnvVars.Port.toString();

/******************************************************************************
                                  Run
******************************************************************************/

// Start the server
server.listen(EnvVars.Port, async (err) => {
  await connectDB();
  await runMigrations();
  if (!!err) {
    logger.err(err.message);
  } else {
    logger.info(SERVER_START_MESSAGE);
  }
});
