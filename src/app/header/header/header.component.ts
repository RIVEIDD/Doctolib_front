import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { tap } from 'rxjs';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

export interface boutonHeader {
  id: number;
  name: string;
  url: string[];
  isDark: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @Output() public isOpenEmitter = new EventEmitter<boolean>();

  public isOpen: boolean = false;
  public userLetters: string;
  public showHelpCenter: boolean = false; // Ajout d'une variable pour contrôler l'affichage du rectangle

  public boutonsHeader: boutonHeader[] = [
    {
      id: 0,
      name: 'Vous êtes soignant ?',
      url: ['/inscription'],
      isDark: true,
    },
    {
      id: 1,
      name: 'Centre d\'aide',
      url: [''],
      isDark: false,
    },
    {
      id: 2, // Changer l'id pour éviter la duplication
      name: 'Connexion',
      url: ['/se_connecter'],
      isDark: false,
    },
  ];

  public isConnected: boolean = false;

  public constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.isConnected = this.authService.isAuthenticated();

    if (this.isConnected) {
      this.userService
        .getUser()
        .pipe(
          tap((user) => {
            this.userLetters = user.firstName[0] + user.lastName[0];
          })
        )
        .subscribe();
    }
  }

  public onBurgerClick(): void {
    this.isOpen = !this.isOpen;
    this.isOpenEmitter.emit(this.isOpen);
  }

  public goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  public toggleHelpCenter(): void { // Méthode pour basculer l'affichage du rectangle
    this.showHelpCenter = !this.showHelpCenter;
  }
}
