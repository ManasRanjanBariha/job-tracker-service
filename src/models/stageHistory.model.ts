import { z } from "zod";
import { Entity } from "./common/types";
import { isString, isUnsignedInteger } from "jet-validators";
import { transformIsDate } from "@src/common/utils/validators";


const GetDefaults = (): IStageHistory => ({
    id: 0,
    applicationId: 0,
    userId: 0,
    stage:'',
    changedAt: new Date(),
    created: new Date(),
});

const schema = z.object({
    id: isUnsignedInteger,
    applicationId: isUnsignedInteger,
    userId: isUnsignedInteger,
    stage: isString,
    changedAt: transformIsDate,
});

const parseStageHistory = (data: any): IStageHistory => {
    const stageHistory: IStageHistory = {
        ...GetDefaults(),
        ...data,
    };
    return stageHistory;
};

function new_(data: Partial<IStageHistory>): IStageHistory {
    return parseStageHistory(data);
}

export interface IStageHistory extends Entity {
    applicationId: number;
    userId: number;
    stage: string;
    changedAt: Date;
    created: Date;
}

const isCompleteStageHistory = schema.extend({
    created: transformIsDate,
});

export default {
    new: new_,
    isComplete: isCompleteStageHistory,
} as const;