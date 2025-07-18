import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { VasaNarrativeFilter } from '../models/vasa-narrative-filter.model';

@Injectable({
  providedIn: 'root'
})
export class OdkVersionService {

  private apiUrl = `${environment.apiUrl}/VASAODKVersion`;

  constructor(private http: HttpClient) { }

  getOdkVersions(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getVasaNarrativeByOdkVersion(odkVersion: string): Observable<any[]> {
    const url = `${environment.apiUrl}/VASANarrative/ByOdkVersion/${odkVersion}`;
    return this.http.get<any[]>(url);
  }

  getVasaNarrativeByFilters(filters: VasaNarrativeFilter): Observable<any[]> {
    const url = `${environment.apiUrl}/VASANarrative/ByFilters`;
    return this.http.post<any[]>(url, filters);
  }

  getVasaNarrativeDetails(odkVersion: string, uuid: string): Observable<any> {
    const url = `${environment.apiUrl}/VASANarrative/ByVasaUUID/${odkVersion}/${uuid}`;
    return this.http.get<any>(url);
  }

  postVasaNarrative(payload: any): Observable<any> {
    debugger;
    const url = `${environment.apiUrl}/VASANarrative`;
    return this.http.post(url, payload, { responseType: 'text' });
  }

  putVasaNarrative(payload: any): Observable<any> {
    debugger;
    const url = `${environment.apiUrl}/VASANarrative`;
    return this.http.put(url, payload, { responseType: 'text' });
  }
}