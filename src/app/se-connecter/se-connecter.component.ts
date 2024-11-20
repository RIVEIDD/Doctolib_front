import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-se-connecter',
  templateUrl: './se-connecter.component.html',
  styleUrls: ['./se-connecter.component.scss']
})
export class SeConnecterComponent {

  constructor(private router: Router) {}

  // Méthode pour rediriger vers la page d'inscription (si nécessaire)
  goToInscription() {
    this.router.navigate(['/inscription']); // Redirige vers la route 'inscription'
  }


  // Méthode pour rediriger vers la page de connexion
  goToConnexion() {
    this.router.navigate(['/connexion']); // Redirige vers la route 'connexion'
  }
}
