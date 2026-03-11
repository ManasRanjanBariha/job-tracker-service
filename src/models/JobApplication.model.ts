import { isNonEmptyString, isString, isUnsignedInteger } from 'jet-validators';
import { parseObject, Schema, testObject } from 'jet-validators/utils';

import { transformIsDate } from '@src/common/utils/validators';

import { Entity } from './common/types';
import { parser } from 'typescript-eslint';

const GetDefaults = (): IJobApplication => ({
    id: 0,
    userId: 0,
    company: '',
    role: '',
    stage: 'Applied',
    salary: 0,
    appliedDate: new Date(),
    interviewDate: undefined,
    note: '',
    jobUrl: '',
    created: ''
});

const schema: Schema<IJobApplication> = {
    id: isUnsignedInteger,
    userId: isUnsignedInteger,
    company: isString,
    role: isString,
    stage: isString,
    salary: isUnsignedInteger,
    appliedDate: transformIsDate,
    interviewDate: (value: unknown): value is Date | undefined => value === undefined || value instanceof Date,
    note: isString,
    jobUrl: isString,
    created: function (arg: unknown): arg is string | Date {
        throw new Error('Function not implemented.');
    }
};


export interface IJobApplication extends Entity {
  userId: number;
  company: string;
  role: string;
  stage: string; // e.g. "Applied", "Interviewing", "Offer", "Rejected"
  salary: number;
  appliedDate: Date;
  interviewDate?: Date; // Optional, only if stage is "Interviewing"
  note: string;
  jobUrl: string;
}

const parseJobApplication = parseObject<IJobApplication>(schema);

const isCompleteJobApplication = testObject<IJobApplication>({
    ...schema,
    company: isNonEmptyString,
    role: isNonEmptyString,
    stage: isNonEmptyString,
    salary: isUnsignedInteger,
    appliedDate: transformIsDate,
    interviewDate: (value: unknown): value is Date | undefined => value === undefined || value instanceof Date,
    note: isString,
    jobUrl: isString,
    created: function (arg: unknown): arg is string | Date {
        throw new Error('Function not implemented.');
    }
}, (errors) => {
    throw new Error('JobApplication validation failed ' + JSON.stringify(errors, null, 2));
});
const parserseJobApplication = parseObject<IJobApplication>(schema);

function new_(JobApplication?: Partial<IJobApplication>): IJobApplication {
    return parserseJobApplication({
        ...GetDefaults(),
        ...JobApplication,
    },
    (errors) => {        throw new Error('Setup new JobApplication failed ' + JSON.stringify(errors, null, 2));
    });
}

export default {
    new: new_,
    isComplete: isCompleteJobApplication,
    parse: parseJobApplication,
};
