export interface LeaveRequest {
  id: number;
  employeeId: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  totalDays: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string; // ISO date string
}