import {DashboardComponent} from './_components/dashboard/dashboard.component';
import {HeroDetailsComponent} from './_components/hero-details/hero-details.component';
import {HeroesComponent} from './_components/heroes/heroes.component';
import {HomeComponent} from './_components/home/home.component';
import {LoginComponent} from './_components/login/login.component';
import {AuthGuardService} from './_guards/auth-guard.service';
import {RoleGuardService} from './_guards/role-guard.service';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'heroes', component: HeroesComponent, canActivate: [AuthGuardService]},
  {path: 'detail/:id', component: HeroDetailsComponent, canActivate: [AuthGuardService]},
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService, RoleGuardService], data: {
      expectedRole: ['ROLE_ADMIN']
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
