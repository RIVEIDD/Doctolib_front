import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://localhost:3000/api/doctors';  // URL de ton API

  constructor(private http: HttpClient) {}

  searchDoctors(specialty: string, city: string): Observable<any> {
    let params = new HttpParams();

    if (specialty) {
      params = params.set('specialty', specialty);
    }
    if (city) {
      params = params.set('city', city);
    }

    return this.http.get<any[]>(this.apiUrl, { params });
  }
}
