import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

export interface boutonAppointments {
  id: number;
  name: string;
  isDark: boolean;
}

@Component({
  selector: 'app-appointments',
  standalone: true,
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss'
})
export class AppointmentsComponent {
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
    this.router.navigate(['/']); // Redirige vers la route 'inscription'
  }


}
