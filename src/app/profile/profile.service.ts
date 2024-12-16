import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = 'http://localhost:3000/api/users'; // Remplace par l'URL de ton API

  constructor(private http: HttpClient) {}

  // Recherche un utilisateur par son prénom
  searchUserByFirstname(firstname: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search?firstname=${firstname}`);
  }
}
