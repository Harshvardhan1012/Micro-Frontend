import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactHostComponent } from './components/micro_frontend/react-host.component';
import { RouterLinkWithHref } from "@angular/router";
import { ReactWrapperComponent } from "./components/micro_frontend/react-wrapper.component";

@Component({
  selector: 'app-home',
  template: `
    <div class="app-container">
      <!-- Your new app-hello component -->
      sdf

      <!-- <react-host
        componentName="HelloComponent"
        microfrontendName="hostApp"
      >
      </react-host>

      <react-host
        componentName="HelloComponent"
        microfrontendName="hostApp"
      >
      </react-host> -->
      <app-react-wrapper></app-react-wrapper>
      <a routerLink="new">Go to New Component</a>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, RouterLinkWithHref, ReactWrapperComponent],
})
export class AppComponent {
  // No additional properties needed for this simple demo
}
