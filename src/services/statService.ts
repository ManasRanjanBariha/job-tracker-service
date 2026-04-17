import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";
import { RouteError } from "@src/common/utils/route-errors";
import { IStageHistory } from "@src/models/stageHistory.model";
import StageHistoryRepo from "@src/repos/StageHistoryRepo";

async function getStageHistoryByApplicationId(userId: number): Promise<IStageHistory[]> {
  return StageHistoryRepo.overview(userId);
}

async function getFunnelData(userId: number): Promise<any> {
  return StageHistoryRepo.funnel(userId);
}

async function getAverageInterviewTime(userId: number): Promise<any> {
  return StageHistoryRepo.avargeInterviewTime(userId);
}

async function timeline(userId: number): Promise<any> {
    return StageHistoryRepo.timeline(userId);
}

async function getResponseOfRate(userId: number): Promise<any> {
    return StageHistoryRepo.rateofResponse(userId);
}


export default {
  getStageHistoryByApplicationId,
  getFunnelData,
  getAverageInterviewTime,
  timeline,
  getResponseOfRate
} as const;
