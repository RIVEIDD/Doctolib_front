import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
      firstName: ['', [Validators.required, this.customDotValidator()]],
      lastName: ['', [Validators.required, this.customDotValidator()]],
      email: ['', [Validators.required, Validators.email]], // Champ email avec validation
      password: ['', [Validators.required, Validators.minLength(6)]],
      birthDate: ['', [Validators.required, this.dateValidator()]],
    });
  }
  // Méthode du validateur personnalisé
  customDotValidator() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.touched) {
        return null; // Pas encore touché, ne validez pas
      }
      const value = control.value;
      // Vérifie si le texte contient des caractères interdits
      const forbiddenPattern = /[0-9./]/; // Chiffres, points et slashes
      if (value && forbiddenPattern.test(value)) {
        return { forbiddenCharacters: 'Le texte contient des caractères interdits.' };
      }
      return null; // Aucun problème
    };
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

  public getEmail(): string{
    return this.inscriptionForm.get('email')?.value || ''; // retourne une chaîne vide si non défini
  }
  
  
  

  public isInvalidField(formControlName: string): boolean {
    const field = this.inscriptionForm.get(formControlName);
    return (field?.invalid && field?.touched) ?? true;
  }

  public isValidField(formControlName: string): boolean {
    const field = this.inscriptionForm.get(formControlName);
    return (field?.valid && field?.touched) ?? true;
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


