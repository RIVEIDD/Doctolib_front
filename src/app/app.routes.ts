import { Routes } from '@angular/router';
import { ConnexionComponent } from './connexion/connexion.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { ChatComponent } from './chat/chat.component';
import { AuthGuard } from './guards/auth.guard';
import { AnonymousGuard } from './guards/anonymous.guard';
import { ProfileComponent } from './profile/profile.component';
import { HeaderComponent } from './header/header/header.component';
import { HomeComponent } from './home/home.component';
import { SeConnecterComponent } from './se-connecter/se-connecter.component';
import { HomeProfileComponent } from './home-profile/home-profile.component';
import { MesRendezVousComponent } from './mes-rendez-vous/mes-rendez-vous.component';

export const routes: Routes = [
    //{ path: '', redirectTo: 'signin', pathMatch: 'full' },
    //{ path: 'header', component: HeaderComponent, canActivate: [AnonymousGuard] },
    //{ path: '', component: HomeComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'home-profile', component: HomeProfileComponent },
    { path: 'mes-rendez-vous', component: MesRendezVousComponent },
    { path: 'connexion', component: ConnexionComponent, canActivate: [AnonymousGuard] },
    { path: 'se_connecter', component: SeConnecterComponent, canActivate: [AnonymousGuard] },
    { path: 'inscription', component: InscriptionComponent, canActivate: [AnonymousGuard] },
    { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] }
];
