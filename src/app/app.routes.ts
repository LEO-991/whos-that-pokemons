import { Routes } from '@angular/router';

import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LobbyComponent } from './lobby/lobby.component';
import { GameComponent } from './game/game.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'lobby', component: LobbyComponent },
  { path: 'game', component: GameComponent },
  { path: 'leaderboards', component: LeaderboardComponent },
  { path: 'user-menu', component: UserMenuComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: '**', component: NotFoundComponent }
];
