import { Routes } from '@angular/router';
import { MicroFrontendDemoComponent } from './components/micro_frontend/demo.component';
import { AppComponent } from './app.component';
// import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    title: 'Home - Angular App',
  },
];
