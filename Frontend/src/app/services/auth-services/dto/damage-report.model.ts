export interface DamageReport {
  damageReportId: number;
  reservationId: number;
  vehicleId: number;
  userId: number;
  reportDate: string;
  description: string;
  estimatedRepairCost: number;
  status: string;
}
