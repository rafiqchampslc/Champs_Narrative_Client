import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { VasaListComponent } from './vasa-list/vasa-list';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'vasa-list', component: VasaListComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];