import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";
import { RouteError } from "@src/common/utils/route-errors";
import { IJobApplication } from "@src/models/JobApplication.model";
import { IStageHistory } from "@src/models/stageHistory.model";
import statService from "@src/services/statService";
import { AuthenticatedRequest } from "@src/middleware/authMiddleware"; 
import {dashboardService} from "@src/services/dashBoardService";


async function getStageHistoryByApplicationId(req: AuthenticatedRequest, res: any) {
    if (!req.user) {
        throw new RouteError(
            HttpStatusCodes.UNAUTHORIZED,
            'User not authenticated',
        );
    }
    const userId = req.user.userId;
    const stageHistory = await statService.getStageHistoryByApplicationId(userId);
    res.status(HttpStatusCodes.OK).json({ stageHistory });
}

async function getFunnelData(req: AuthenticatedRequest, res: any) {
    if (!req.user) {
        throw new RouteError(
            HttpStatusCodes.UNAUTHORIZED,
            'User not authenticated',
        );
    }
    const userId = req.user.userId;
    const funnelData = await statService.getFunnelData(userId);
    res.status(HttpStatusCodes.OK).json({ funnelData });
}

async function getAverageInterviewTime(req: AuthenticatedRequest, res: any) {
    if (!req.user) {
        throw new RouteError(
            HttpStatusCodes.UNAUTHORIZED,
            'User not authenticated',
        );
    }
    const userId = req.user.userId;
    const avgInterviewTime = await statService.getAverageInterviewTime(userId);
    res.status(HttpStatusCodes.OK).json({ avgInterviewTime });
}

async function getTimelineData(req: AuthenticatedRequest, res: any) {
    if (!req.user) {
        throw new RouteError(
            HttpStatusCodes.UNAUTHORIZED,
            'User not authenticated',
        );
    }
    const userId = req.user.userId;
    const timelineData = await statService.timeline(userId);
    res.status(HttpStatusCodes.OK).json({ timelineData });
}

async function  getRateOfResponse(req: AuthenticatedRequest, res: any) {
    if (!req.user) {
        throw new RouteError(
            HttpStatusCodes.UNAUTHORIZED,
            'User not authenticated',
        );
    }
    const userId = req.user.userId;
    const responseRate = await statService.getResponseOfRate(userId);
    res.status(HttpStatusCodes.OK).json({ responseRate });
}

async function getDashboardData(req: AuthenticatedRequest, res: any) {
    if (!req.user) {
        throw new RouteError(
            HttpStatusCodes.UNAUTHORIZED,   
            'User not authenticated',
        );
    }
    const userId = req.user.userId;
    const dashboardData = await dashboardService.getDashboardData(userId);
    res.status(HttpStatusCodes.OK).json({ dashboardData });
}


export default {
    getStageHistoryByApplicationId,
    getFunnelData,
    getAverageInterviewTime,
    getTimelineData,
    getRateOfResponse,
    getDashboardData
} as const;