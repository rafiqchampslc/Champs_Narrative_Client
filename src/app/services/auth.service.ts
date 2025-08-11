import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { VasaNarrativeFilter } from '../models/vasa-narrative-filter.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Users`;

  // Filter state properties
  currentOdkVersion: string = '0';
  currentDeathType: string = '0';
  currentNarrativeStatus: string = '0';
  currentDateFrom: Date | null = null;
  currentDateTo: Date | null = null;
  currentFilterText: string = '';
  currentPageIndex: number = 0;
  currentPageSize: number = 10;

  constructor(private http: HttpClient) { }

  loginUser(userId: string, password: string): Observable<any> {
      return this.http.get<any>(
    `${this.apiUrl}/${encodeURIComponent(userId)}/${encodeURIComponent(password)}`
    );
    //return this.http.get<any>(`${this.apiUrl}/${userId}/${password}`);
  }

  setLoginState(userId: string, role: number) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('loggedInUserId', userId);
    localStorage.setItem('loggedInUserRole', role.toString());
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loggedInUserId');
    localStorage.removeItem('loggedInUserRole');
    // Clear filter state on logout
    this.currentOdkVersion = '0';
    this.currentDeathType = '0';
    this.currentNarrativeStatus = '0';
    this.currentDateFrom = null;
    this.currentDateTo = null;
    this.currentFilterText = '';
    this.currentPageIndex = 0;
    this.currentPageSize = 10;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  getLoggedInUserId(): string | null {
    return localStorage.getItem('loggedInUserId');
  }

  getLoggedInUserRole(): number | null {
    const role = localStorage.getItem('loggedInUserRole');
    return role ? parseInt(role, 10) : null;
  }

  // Methods to set and get filter state
  setFilterState(odkVersion: string, deathType: string, narrativeStatus: string, dateFrom: Date | null, dateTo: Date | null, filterText: string, pageIndex: number, pageSize: number) {
    debugger;
    this.currentOdkVersion = odkVersion;
    this.currentDeathType = deathType;
    this.currentNarrativeStatus = narrativeStatus;
    this.currentDateFrom = dateFrom;
    this.currentDateTo = dateTo;
    this.currentFilterText = filterText;
    this.currentPageIndex = pageIndex;
    this.currentPageSize = pageSize;
  }

  getFilterState() {
    debugger;
    return {
      odkVersion: this.currentOdkVersion,
      deathType: this.currentDeathType,
      narrativeStatus: this.currentNarrativeStatus,
      dateFrom: this.currentDateFrom,
      dateTo: this.currentDateTo,
      filterText: this.currentFilterText,
      pageIndex: this.currentPageIndex,
      pageSize: this.currentPageSize
    };
  }
}