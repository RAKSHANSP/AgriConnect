import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ProductList } from './components/product-list/product-list';
import { Weather } from './components/weather/weather';
import { Chat} from './components/chat/chat';
import { OfficialsChat} from './components/officials-chat/officials-chat';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Initial landing page
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent},
  { path: 'dashboard', component: DashboardComponent, children: [
      { path: 'products', component: ProductList },
      { path: 'weather', component: Weather },
      { path: 'chat', component: Chat},
      { path: 'officials', component: OfficialsChat }
  ]},
  { path: '**', redirectTo: '' } // fallback
];
