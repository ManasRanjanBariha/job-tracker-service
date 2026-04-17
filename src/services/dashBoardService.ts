import HttpStatusCodes from '@src/common/constants/httpStatusCodes';
import { RouteError } from '@src/common/utils/route-errors';
import JobApplicationRepo from '@src/repos/JobApplicationRepo';
import StageHistoryRepo from '@src/repos/StageHistoryRepo';

async function getDashboardData(userId: number): Promise<any> {
  try {
    const overviewData = await StageHistoryRepo.overview(userId);
    const funnelData = await StageHistoryRepo.funnel(userId);
    const avgInterviewTime = await StageHistoryRepo.avargeInterviewTime(userId);
    const timelineData = await StageHistoryRepo.timeline(userId);
    const recentApplications =
      await JobApplicationRepo.getlastSixApplications(userId);
    const lastSevenMonthsData = await StageHistoryRepo.getlastSevenMonthsData(userId);
    return {
      overview: overviewData,
      funnel: funnelData,
      avgInterviewTime: avgInterviewTime,
      timeline: timelineData,
      lastSevenMonthsData: lastSevenMonthsData,
      recentApplications: recentApplications,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw new RouteError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to fetch dashboard data',
    );
  }
}

export const dashboardService = {
  getDashboardData,
};