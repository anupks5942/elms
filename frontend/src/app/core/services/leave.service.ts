import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LeaveRequest } from '../models/leave-request.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  private baseUrl = `${environment.apiUrl}/leaves`;

  constructor(private http: HttpClient) { }

  applyLeave(employeeId: number, startDate: string, endDate: string): Observable<LeaveRequest> {
    const payload = { employeeId, startDate, endDate };
    return this.http.post<LeaveRequest>(`${this.baseUrl}/apply`, payload)
      .pipe(
        catchError(this.handleError)
      );
  }

  getMyLeaves(employeeId: number): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.baseUrl}/my/${employeeId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getPendingLeaves(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.baseUrl}/pending`)
      .pipe(
        catchError(this.handleError)
      );
  }

  approveLeave(leaveId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/approve/${leaveId}`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  rejectLeave(leaveId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/reject/${leaveId}`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}