import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { NewComponent } from './new.component';
// import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    title: 'Home - Angular App',
  },
  {
    path: 'new',
    component: NewComponent,
    title: 'HomeApp',
  },
];
