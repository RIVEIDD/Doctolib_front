import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, EMPTY, Observable, tap } from 'rxjs';
import { User } from '../types/user.interface';
import { SignupSuccess } from '../types/signupSuccess.interface';
import { SignupSuccessService } from '../services/signupSuccess.service';


@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule, RouterLink, CommonModule],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.scss',
})
export class InscriptionComponent {
  // Attributes
  public inscriptionForm: FormGroup;
  public inscriptionError: Error | undefined;
  public loading: boolean = false;
  public stepInscription: number = 1;

  // Constructor
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private successService: SignupSuccessService
  ) {
    this.inscriptionForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
    });
  }

  // Method to check if a field is invalid
  public isInvalidField(formControlName: string): boolean {
    const field = this.inscriptionForm.get(formControlName);
    return (field?.invalid && field?.touched) ?? true;
  }

  // Method to validate the form and create a user
  public inscription(): void {
    this.inscriptionForm.markAllAsTouched();
    if (this.inscriptionForm.valid) {
      this.loading = true;
      this.userService
        .createUser(this.inscriptionForm.value)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.inscriptionError = error.error;
            this.loading = false;
            return EMPTY;
          }),
          tap((res: Partial<User>) => {
            if (res) {
              const signupSuccess: SignupSuccess = {
                succes: 'Sign up successful',
                name: this.inscriptionForm.value.firstName,
                email: this.inscriptionForm.value.email,
              };
              this.successService.setSignupData(signupSuccess);
              this.loading = false;
              this.router.navigate(['/connexion']);
            }
          })
        )
        .subscribe();
    }
  }

  // Validation de la date (format jj/mm/aaaa)
  dateValidator() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
      return dateRegex.test(value) ? null : { invalidDate: true };
    };
  }

  // Formate la date au fur et à mesure que l'utilisateur saisit
  formatBirthDate(event: any): void {
    let input = event.target.value.replace(/\D/g, ''); // Supprime tout ce qui n'est pas un chiffre
    if (input.length > 2) {
      input = input.slice(0, 2) + '/' + input.slice(2);
    }
    if (input.length > 5) {
      input = input.slice(0, 5) + '/' + input.slice(5);
    }
    event.target.value = input.slice(0, 10); // Limite la longueur de la saisie à 10 caractères
  }

  get emailControl(): AbstractControl | null {
    return this.inscriptionForm.get('email');
  }
  
  public isEmailInvalid(): boolean {
    const emailControl = this.inscriptionForm.get('email');
    return emailControl?.invalid && emailControl?.touched ? true : false;
  }
  
  public isEmailValid(): boolean {
    const emailControl = this.inscriptionForm.get('email');
    return emailControl?.valid && emailControl?.touched ? true : false;
  }

  public nextStep(): void {
    console.log('Étape actuelle :', this.stepInscription);

    if (this.stepInscription < 4) {
      this.stepInscription++;
    }
    if (this.stepInscription == 4){
      // Redirection vers une autre page une fois les étapes terminées
      //this.router.navigate(['/connexion']); // Remplacez 'votre-page-cible' par la route réelle
    }
  }

  // Méthode pour gérer l'étape précédente
  backStep() {
    if (this.stepInscription === 1) {
      // Si on est à l'étape 1, rediriger vers la page de connexion
      //this.router.navigate(['/se_connecter']); // Remplacez '/se_connecter' par le chemin réel de votre page de connexion
    } else {
      // Si on n'est pas à l'étape 1, simplement réduire l'étape
      this.stepInscription--;
    }
  }
}
