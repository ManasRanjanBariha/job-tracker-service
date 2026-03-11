import { isNonEmptyString, isString, isUnsignedInteger } from 'jet-validators';
import { parseObject, Schema, testObject } from 'jet-validators/utils';

import { transformIsDate } from '@src/common/utils/validators';

import { Entity } from './common/types';

/******************************************************************************
                                 Constants
******************************************************************************/

const GetDefaults = (): IUser => ({
  id: 0,
  name: '',
  email: '',
  password: '',
  refreshToken: '',
  created: new Date(),  
});

const schema: Schema<IUser> = {
  id: isUnsignedInteger,
  name: isString,
  email: isString,
  password: isString,
  created: transformIsDate,
  refreshToken: isString, // Optional field for refresh token
};

/******************************************************************************
                                  Types
******************************************************************************/

/**
 * @entity users
 */
export interface IUser extends Entity {
  name: string;
  email: string;
  password: string;
  created: Date;
  refreshToken?: string; // Optional field for refresh token
}

/******************************************************************************
                                  Setup
******************************************************************************/

// Set the "parseUser" function
const parseUser = parseObject<IUser>(schema);

// For the APIs make sure the right fields are complete
const isCompleteUser = testObject<IUser>({
  ...schema,
  name: isNonEmptyString,
  email: isNonEmptyString,
  password: isNonEmptyString,
  created: transformIsDate,
  refreshToken: isString, // Optional field for refresh token
}, (errors) => {
  throw new Error('User validation failed ' + JSON.stringify(errors, null, 2));
});

/******************************************************************************
                                 Functions
******************************************************************************/

/**
 * New user object.
 */
function new_(user?: Partial<IUser>): IUser {
  return parseUser({ ...GetDefaults(), ...user }, (errors) => {
    throw new Error('Setup new user failed ' + JSON.stringify(errors, null, 2));
  });
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  new: new_,
  isComplete: isCompleteUser,
} as const;
