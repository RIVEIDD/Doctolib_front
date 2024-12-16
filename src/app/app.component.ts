import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header/header.component';
import { HomeComponent } from './home/home.component';
import { Router, NavigationEnd } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { HeaderProfileComponent } from './header-profile/header-profile.component';
import { HomeProfileComponent } from './home-profile/home-profile.component';
import { MesRendezVousComponent } from './mes-rendez-vous/mes-rendez-vous.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, HeaderProfileComponent, HomeComponent, HomeProfileComponent, MesRendezVousComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public currentRoute: string = '';

  constructor(private router: Router) {}
  title = 'Docolib';

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Vérifiez la route actuelle et mettez à jour 'currentRoute'
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }
}
