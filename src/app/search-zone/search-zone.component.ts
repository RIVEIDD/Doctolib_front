import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Ajout ici
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { DoctorService } from '../service/doctor.service';

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

  constructor(private http: HttpClient,private userService: UserService,private doctorService: DoctorService) {}

  searchDoctors() {
    this.doctorService.searchDoctors(this.specialty, this.city).subscribe(
      (response) => {
        console.log('Données reçues :', response);
        this.doctors = response;
      },
      (error) => {
        console.error('Erreur lors de la recherche de médecins', error);
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
