export interface Employee {
  id: number;
  name: string;
  role: 'Manager' | 'Employee';
  leaveBalance: number;
}