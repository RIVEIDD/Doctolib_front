import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../types/user.interface';
import { FormsModule } from '@angular/forms';
import {
  catchError,
  debounceTime,
  EMPTY,
  map,
  Observable,
  switchMap,
  take,
  tap,
} from 'rxjs';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { slideFromTop } from '../animations/animations';
import { InscriptionSuccess } from '../types/inscriptionSuccess.interface';
import { SuccessService } from '../services/success.service';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, FormsModule],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.scss',
  animations: [slideFromTop],
})
export class InscriptionComponent {
  // Vos propriétés actuelles
  public stepInscription: number = 1;
  public acceptTerms: boolean = false;
  public inscriptionForm: FormGroup;
  public chargementEnCours: boolean = false;
  public inscriptionError: Error;
  public allUsers: User[] = [];

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private successService: SuccessService
  ) {
    this.inscriptionForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // Champ email avec validation
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
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
  
  
  

  public isInvalidField(formControlName: string): boolean {
    const field = this.inscriptionForm.get(formControlName);
    return (field?.invalid && field?.touched) ?? true;
  }

  public inscription(): void {
    this.inscriptionForm.markAllAsTouched();
    if (this.inscriptionForm.valid) {
      this.chargementEnCours = true;
      this.userService
        .createUser(this.inscriptionForm.value)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.inscriptionError = error.error;
            this.chargementEnCours = false;
            return EMPTY;
          }),
          tap((res: Partial<User>) => {
            if (res) {
              const inscriptionSuccess: InscriptionSuccess = {
                succes: 'Inscription réussie',
                name: this.inscriptionForm.value.firstName,
                email: this.inscriptionForm.value.email,
              };
              this.successService.setInscriptionData(inscriptionSuccess);
              this.router.navigate(['/connexion']);
            }
          })
        )
        .subscribe();
    }
  }

  public getUsers$(): Observable<User[]> {
    return this.userService.getUsers();
  }

  public nextStep(): void {
    console.log('Étape actuelle :', this.stepInscription);

    if (this.stepInscription < 4) {
      this.stepInscription++;
    }
  }

  // Méthode pour gérer l'étape précédente
  backStep() {
    if (this.stepInscription === 1) {
      // Si on est à l'étape 1, rediriger vers la page de connexion
      this.router.navigate(['/se_connecter']); // Remplacez '/se_connecter' par le chemin réel de votre page de connexion
    } else {
      // Si on n'est pas à l'étape 1, simplement réduire l'étape
      this.stepInscription--;
    }
  }

  public onTermsChange(): void {
    this.acceptTerms = !this.acceptTerms;
    console.log('Accept Terms:', this.acceptTerms);
  }
}


