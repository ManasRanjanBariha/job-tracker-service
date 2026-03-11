import jetEnv,{str,num} from 'jet-env';

/******************************************************************************
                                 Constants
******************************************************************************/

// NOTE: These need to match the names of your ".env" files
export const NodeEnvs = {
  DEV: 'development',
  TEST: 'test',
  PRODUCTION: 'production',
} as const;

/******************************************************************************
                                 Setup
******************************************************************************/

const EnvVars = jetEnv({
  NodeEnv: str,
  Port: num, // <-- STOP! This is a number.
  JwtSecret: str,
  JwtExpiration: str,
  JwtRefreshSecret: str,
  JwtRefreshExpiration: str,
});

/******************************************************************************
                            Export default
******************************************************************************/

export default EnvVars;
