import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { User } from '../types/user.interface';

export interface boutonHeader {
  id: number;
  name: string;
  url: string[];
  isDark: boolean;
}

@Component({
  selector: 'app-header-profile',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header-profile.component.html',
  styleUrl: './header-profile.component.scss',
})
export class HeaderProfileComponent implements OnInit {

  @Output() public isOpenEmitter = new EventEmitter<boolean>();

  public isOpen: boolean = false;
  public userLetters: string;
  public showHelpCenter: boolean = false; // Ajout d'une variable pour contrôler l'affichage du rectangle

  public isConnected: boolean = false;
  //public user: { firstName: string; lastName: string } | null = null; // Données utilisateur
  public isDropdownOpen: boolean = false;

  public constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  public user: User | null = null;


  public ngOnInit(): void {
    this.isConnected = this.authService.isAuthenticated();

    if (this.isConnected) {
      this.userService
        .getUser()
        .pipe(
          tap((user) => {
            this.userLetters = user.firstName[0] + user.lastName[0];
            this.user = user;
            console.log('name: ',user.firstName);
            console.log('lastname: ',user.lastName);
          })
        )
        .subscribe();
    }
  }

  public onBurgerClick(): void {
    this.isOpen = !this.isOpen;
    this.isOpenEmitter.emit(this.isOpen);
  }


  public toggleHelpCenter(): void { // Méthode pour basculer l'affichage du rectangle
    this.showHelpCenter = !this.showHelpCenter;
  }

    // Basculer le menu déroulant
    toggleDropdown(): void {
      this.isDropdownOpen = !this.isDropdownOpen;
    }
  
    // Naviguer vers la page de profil
    goToProfile(): void {
      this.isDropdownOpen = false;
      this.router.navigate(['/profile']);
    }
  
    // Déconnexion
    logout(): void {
      this.isDropdownOpen = false;
      this.authService.logout(); // Méthode fictive, à implémenter dans AuthService
      this.router.navigate(['/home']);
    }
}
