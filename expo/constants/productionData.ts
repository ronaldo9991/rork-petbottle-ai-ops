export const productionMetrics = {
  totalBottlesPerHour: 2330,
  dailyProduction: 32620,
  oee: 0.86,
  oeeRobotics: 0.88,
  defectRate: 1.2,
  downtime: 45,
  aiRiskScore: 0.12,

  machineBottlesPerHour: 1350,
  machineBottlesPerMachine: 135,
  machineOEE: 0.86,
  machineUtilization: 0.84,
  machineDefectRate: 3,
  machineCostPerBottle: 0.095,
  machineEnergyPer1000: 18.5,
  machineWorkers: 5,
  machineLaborCostPerHour: 125,
  totalMachines: 10,
  operationalMachines: 8,

  robotBottlesPerHour: 980,
  robotOEE: 0.88,
  robotUtilization: 0.81,
  robotDefectRate: 0,
  robotCostPerBottle: 0.090,
  robotEnergyPer1000: 15.2,
  robotWorkers: 2,
  robotLaborCostPerHour: 50,
  totalRobots: 5,
  operationalRobots: 4,

  machineDailyKwh: 245,
  robotDailyKwh: 117,
  totalDailyKwh: 362,
  machineDailyCost: 29.11,
  robotDailyCost: 13.80,
  totalDailyCost: 42.91,
  energySavings: 15.31,
  energySavingsPercent: 52.6,

  totalWorkers: 7,
  totalLaborCostPerHour: 175,
  dailyLaborCost: 2450,

  weightMin: 24.0,
  weightMax: 26.0,
  thicknessMin: 0.40,
  thicknessMax: 0.46,
  totalDefects: 12,
  goodBottles: 988,

  onTimeRate: 0.92,
  machineUtilizationSchedule: 0.84,
  robotUtilizationSchedule: 0.87,
  setupChanges: 8,
  totalTime: 2880,
  riskCost: 0.15,
};

export const hourlyData = [
  { hour: '08:00', actual: 2330, target: 2200 },
  { hour: '09:00', actual: 2330, target: 2200 },
  { hour: '10:00', actual: 2330, target: 2200 },
  { hour: '11:00', actual: 2330, target: 2200 },
  { hour: '12:00', actual: 2330, target: 2200 },
  { hour: '13:00', actual: 2330, target: 2200 },
  { hour: '14:00', actual: 2330, target: 2200 },
  { hour: '15:00', actual: 2330, target: 2200 },
];

export const downtimeReasons = [
  { reason: 'Maintenance', minutes: 18, percentage: 40 },
  { reason: 'Setup Change', minutes: 12, percentage: 27 },
  { reason: 'Quality Issue', minutes: 8, percentage: 18 },
  { reason: 'Material Shortage', minutes: 5, percentage: 11 },
  { reason: 'Other', minutes: 2, percentage: 4 },
];

export const defectTypes = [
  { type: 'Thin Wall', count: 4, percentage: 35 },
  { type: 'Overweight', count: 3, percentage: 24 },
  { type: 'Surface Flaw', count: 3, percentage: 21 },
  { type: 'Neck Deformity', count: 1, percentage: 12 },
  { type: 'Other', count: 1, percentage: 8 },
];

export const recentActivities = [
  { id: '1', message: 'Machine M-003 maintenance completed', time: '2 min ago', type: 'maintenance' },
  { id: '2', message: 'New ticket T-20250115-1234 created', time: '15 min ago', type: 'ticket' },
  { id: '3', message: 'Quality check passed - 1000 bottles', time: '1 hour ago', type: 'quality' },
  { id: '4', message: 'Schedule optimized - 18% improvement', time: '2 hours ago', type: 'schedule' },
  { id: '5', message: 'Energy efficiency alert resolved', time: '3 hours ago', type: 'alert' },
];
