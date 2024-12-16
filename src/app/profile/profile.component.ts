import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators,FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { User } from '../types/user.interface';
import { combineLatest, finalize, take, tap } from 'rxjs';
import { SigninSuccessService } from '../services/signinSuccess.service';
import { SigninSuccess } from '../types/signinSuccess.interface';
import { AlertComponent } from "../alert/alert.component";
import { ProfileService } from './profile.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, AlertComponent,FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  public profileForm: FormGroup;
  public signinSuccess: SigninSuccess;
  //public user: User;
  public loading = false;
  public updateSuccess = false;

  searchTerm: string = ''; // Stocke le terme de recherche
  user: any = null; // L'utilisateur recherché

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private profileService: ProfileService,
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', Validators.required],
      API_key: ['', Validators.required]
    });
  }

  public ngOnInit(): void {    
    this.userService.getMe()
      .pipe(
        tap((user) => {
          this.user = user
          this.profileForm.patchValue(user);
        })
      )
      .subscribe();
  }

  public updateProfile(): void {
    this.loading = true;
    const userRequest: User = {
      firstName: this.profileForm.get('firstName')?.value,
      lastName: this.profileForm.get('lastName')?.value,
      email: this.profileForm.get('email')?.value,
      birthDate: this.profileForm.get('birthDate')?.value
    };
    this.userService
      .updateUser(userRequest)
      .pipe(
        take(1),
        tap((res) => {
          if (res) {
            this.updateSuccess = true;
            setTimeout(() => {
              this.updateSuccess = false;
            }, 3000);
          }
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe();
  }

  public backHome(): void {
    this.router.navigate(['/home-profile']);
  }

  searchUser(): void {
    if (this.searchTerm.trim()) {
      this.profileService.searchUserByFirstname(this.searchTerm).subscribe(
        (data) => {
          this.user = data; // Stocke l'utilisateur trouvé
        },
        (error) => {
          console.error('Erreur lors de la recherche', error);
        }
      );
    }
  }
}
