import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

export interface boutonAppointments {
  id: number;
  name: string;
  isDark: boolean;
}
@Component({
  selector: 'app-mes-rendez-vous',
  standalone: true,
  imports: [],
  templateUrl: './mes-rendez-vous.component.html',
  styleUrl: './mes-rendez-vous.component.scss'
})
export class MesRendezVousComponent {

  constructor(private router: Router) {}
  public showPreviewsAppointments: boolean = false; // Ajout d'une variable pour contrôler l'affichage du rectangle
  public boutonsAppointments: boutonAppointments[] = [
    {
      id: 0,
      name: 'VOIR MES RENDEZ-VOUS PASSÉS',
      // url: ['/inscription'],
      isDark: true,
    },
  ];
  public togglePreviewsAppointments(): void { // Méthode pour basculer l'affichage du rectangle
    this.showPreviewsAppointments = !this.showPreviewsAppointments;
  }
  
  // Méthode pour rediriger vers la page d'inscription (si nécessaire)
  goToHome() {
    this.router.navigate(['/home-profile']); // Redirige vers la route 'inscription'
  }

}
