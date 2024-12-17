import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../service/doctor.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-prendre-rendez-vous',
  templateUrl: './prendre-rendez-vous.component.html',
  styleUrls: ['./prendre-rendez-vous.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class PrendreRendezVousComponent implements OnInit {
  doctorId: string | null = null;
  doctors: any[] = []; // Stocke les résultats des médecins
  doctorI: number;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private doctorService: DoctorService
  ) {}

  searchDoctorsById() {
    if (this.doctorId) {
      console.log('id search: ', this.doctorId);  // Vérifier l'ID du médecin passé
      this.doctorService.searchDoctorsbyId(this.doctorId).subscribe(
        (response) => {
          console.log('Données reçues :', response);
          this.doctors = response;
          console.log('Médecins trouvés: ', this.doctors);  // Vérifier les médecins reçus
        },
        (error) => {
          console.error('Erreur lors de la recherche de médecins', error);
        }
      );
    }
  }
  

  ngOnInit(): void {
    // Récupère l'ID du médecin depuis l'URL
    this.doctorId = this.route.snapshot.paramMap.get('id');
    console.log('id: ', this.doctorId);
  
    if (this.doctorId) {
      // Conversion explicite de 'doctorId' en nombre si ce n'est pas 'null'
      this.doctorI = parseInt(this.doctorId, 10);
      this.searchDoctorsById();  // Appeler la recherche des médecins
    }
  }
  
  
}
