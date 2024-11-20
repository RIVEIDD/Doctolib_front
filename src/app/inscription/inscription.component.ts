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

  public stepInscription: number= 1;

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
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
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
    this.stepInscription++;
  }

  public backStep(): void {
    console.log('Étape actuelle :', this.stepInscription);
    this.stepInscription--;
  }

  onTermsChange() {
    
    this.acceptTerms = !this.acceptTerms;
    console.log('Accept Terms:', this.acceptTerms);
  }
}


