import { getDB } from '@src/db/database';
import { IJobApplication } from '@src/models/JobApplication.model';
import { IStageHistory } from '@src/models/stageHistory.model';

async function overview(userId: number): Promise<any> {
  const db = getDB();
  const totalApplications = await db.get<IJobApplication>(
    `SELECT COUNT(*) as totalApplications
FROM job_applications
WHERE userId = ?;`,
    userId,
  );
  const applicationsByStage = await db.all<IJobApplication>(
    `SELECT stage, COUNT(*) as count
FROM job_applications
WHERE userId = ?
GROUP BY stage;`,
    userId,
  );
  return {
    totalApplications: totalApplications || 0,
    applicationsByStage: applicationsByStage || [],
  };
}

async function funnel(userId: number): Promise<any> {
  const db = getDB();
  const funnelData = await db.all(
    `SELECT stage, COUNT(DISTINCT applicationId) AS count
  FROM application_stage_history
 WHERE userId = ? GROUP BY stage`,
    userId,
  );
  return funnelData || [];
}

async function avargeInterviewTime(userId: number): Promise<any> {
  const db = getDB();
  const avgTime = await db.get<{ averageTime: number }>(
    `SELECT 
AVG(julianday(i.changedAt) - julianday(a.changedAt)) AS avgDays
FROM application_stage_history a
JOIN application_stage_history i 
ON a.applicationId = i.applicationId
WHERE a.stage='Applied' AND i.stage='Interview' AND a.userId = ?;`,
    userId,
  );
  return avgTime || { averageTime: 0 };
}

async function timeline(userId: number): Promise<IStageHistory[]> {
  const db = getDB();
  const timelineData = await db.all(
    `SELECT DATE(appliedDate) as date, COUNT(*) as count
FROM job_applications
WHERE userId = ?
GROUP BY DATE(appliedDate)
ORDER BY DATE(appliedDate);`,
    userId
  );
  return timelineData || [];
}

async function rateofResponse(userId: number): Promise<any> {
  const db = getDB();
  const responseRate = await db.get(
    `SELECT
  COUNT(*) AS totalApplications,

  SUM(CASE WHEN stage = 'Interview' THEN 1 ELSE 0 END) AS interviews,
  SUM(CASE WHEN stage = 'Rejected' THEN 1 ELSE 0 END) AS rejections,

  ROUND(
    (SUM(CASE WHEN stage = 'Interview' THEN 1 ELSE 0 END) * 100.0) / COUNT(*),
    2
  ) AS interviewRate,

  ROUND(
    (SUM(CASE WHEN stage = 'Rejected' THEN 1 ELSE 0 END) * 100.0) / COUNT(*),
    2
  ) AS rejectionRate

FROM job_applications
WHERE userId = ?;`,
    userId,
  );
  return responseRate || {
    totalApplications: 0,
    interviews: 0, }
}

async function addStageHistory(applicationId: number, stage: string,userId:number): Promise<void> {
  const db = getDB();
  await db.run(
    "INSERT INTO application_stage_history (applicationId, stage,userId) VALUES (?, ?,?)",
    [applicationId, stage,userId]
  );
}

// GEtting last 7 months data for dashboard
async function getlastSevenMonthsData(userId: number): Promise<any> {
  const db = getDB();
  const data = await db.all(
    `SELECT 
  strftime('%m-%Y', appliedDate) AS month,
  COUNT(*) AS jobs_applied,
  COUNT(CASE WHEN interviewDate IS NOT NULL THEN 1 END) AS interviews_attended
FROM job_applications
WHERE appliedDate >= date('now', '-7 months') AND userId = ?
GROUP BY month
ORDER BY appliedDate;`,
    userId,
  );
  return data || [];
}


export default {
  overview,
  funnel,
  avargeInterviewTime,
  timeline,
  rateofResponse,
  addStageHistory,
  getlastSevenMonthsData,
  
};  


