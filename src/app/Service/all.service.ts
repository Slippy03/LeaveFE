import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AllService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all/getUser`);
  }

  getLeaveRequest(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all/getLeaveRequest`);
  }

  getLeaveBalance(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all/getLeaveBalance`);
  }

  createLeaveRequest(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/all/createLeaveRequest`, data);
  }
  updateLeaveRequest(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/all/updateLeaveRequest/${id}`, data);
  }

  updateLeaveBalance(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/all/updateLeaveBalance/${id}`, data);
  }
}
