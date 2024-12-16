import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignupSuccess } from '../types/signupSuccess.interface';
import { SigninSuccess } from '../types/signinSuccess.interface';
import { SignupSuccessService } from '../services/signupSuccess.service';
import { SigninSuccessService } from '../services/signinSuccess.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, EMPTY, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.scss'
})
export class ConnexionComponent {
  public signupSuccess: SignupSuccess | null = null;
  public signinSuccess: SigninSuccess | null = null;
  public signinError: Error;
  public loading: boolean = false;
  public stepInscription: number = 1;

  public loginForm: FormGroup;

  public constructor(
    private signupSuccessService: SignupSuccessService,
    private signinSuccessService: SigninSuccessService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public ngOnInit(): void {
    this.signupSuccess = this.signupSuccessService.getSignupData();

    if (this.signupSuccess) {
      this.loginForm.get('email')?.setValue(this.signupSuccess.email);
    }
  }

  public isInvalidField(formControlName: string): boolean {
    const field = this.loginForm.get(formControlName);
    return (field?.invalid && field?.touched) ?? true;
  }

  public connexion(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const { email, password } = this.loginForm.value;
      console.log(email, password);

      this.authService
        .login(email, password)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.signinError = error.error;
            this.loading = false;
            return EMPTY;
          }),
          tap((response) => {
            this.authService.saveToken(response.token.access_token);
            const signinSuccess: SigninSuccess = {
              succes: 'Sign in successful',
              email: email,
            };
            this.signinSuccessService.setSigninData(signinSuccess);
            this.router.navigate(['/home-profile']).then(() => {
              this.loading = false;
            });
          })
        )
        .subscribe();
    }
  }

  public nextStep(): void {
    console.log('Étape actuelle :', this.stepInscription);

    if (this.stepInscription < 4) {
      this.stepInscription++;
    }
    if (this.stepInscription == 3){
      // Redirection vers une autre page une fois les étapes terminées
      this.router.navigate(['/home-profile']); // Remplacez 'votre-page-cible' par la route réelle
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
