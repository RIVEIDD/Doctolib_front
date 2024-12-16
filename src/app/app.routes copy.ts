import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { AuthGuard } from './guards/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { SeConnecterComponent } from './se-connecter/se-connecter.component';


export const routes: Routes = [
  //{ path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '', component: HomeComponent },
  { path: 'connexion', component: ConnexionComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'se_connecter', component: SeConnecterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: '**', component: PageNotFoundComponent },
];

