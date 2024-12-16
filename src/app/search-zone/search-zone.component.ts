import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Ajout ici
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-search-zone',
  standalone: true,
  imports: [RouterLink,FormsModule,CommonModule],
  templateUrl: './search-zone.component.html',
  styleUrl: './search-zone.component.scss'
})
export class SearchZoneComponent {

  city: string = '';
  specialty: string = '';
  doctors: any[] = []; // Stocke les résultats

  constructor(private http: HttpClient,private userService: UserService) {}

  searchDoctors() {
    // Construire les paramètres de requête
    const params: any = {};
    if (this.city) {
      params.city = this.city;
    }
    if (this.specialty) {
      params.specialty = this.specialty;
    }

    // Effectuer une requête GET vers le back-end
    this.http.get('http://localhost:3000/doctors/search', { params }).subscribe(
      (response: any) => {
        this.doctors = response; // Stocker les résultats
      },
      (error) => {
        console.error('Erreur lors de la recherche de médecins :', error);
      }
    );
  }


  searchFirstName: string = ''; // Stocke le firstName saisi
  searchedUser: any = null;   // Stocke le résultat de la recherche

  searchUser(): void {
    if (this.searchFirstName.trim()) {
      this.userService
        .getUserByFirstName(this.searchFirstName)
        .subscribe(
          (user) => (this.searchedUser = user),
          (error) => {
            console.error('Erreur lors de la recherche :', error);
            this.searchedUser = null;
          }
        );
    }
  }

}
