import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { VasaListComponent } from './vasa-list/vasa-list';
import { AuthGuard } from './auth-guard';

import { VasaNarrativeDetailsComponent } from './vasa-narrative-details/vasa-narrative-details';

import { PageNotFoundComponent } from './page-not-found/page-not-found';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'vasa-list', component: VasaListComponent, canActivate: [AuthGuard] },
    { path: 'vasa-narrative-details/:odkVersion/:uuid', component: VasaNarrativeDetailsComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
]