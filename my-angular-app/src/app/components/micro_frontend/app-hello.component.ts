import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ReactComponentRegistry } from './component-registry';
import { ReactService } from './react.service';

@Component({
  selector: 'app-hello',
  template: `
    <div class="hello-wrapper">
      <div #reactContainer class="react-hello-container"></div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class AppHelloComponent implements AfterViewInit, OnDestroy {
  private root: any = null;
  private HelloComponent: any = null;
  @ViewChild('reactContainer', { static: false }) containerRef!: ElementRef;

  async ngAfterViewInit() {
    await ReactService.initialize();
    this.HelloComponent = await ReactComponentRegistry.loadComponent('HelloComponent', 'hostApp');
    this.root = ReactService.createReactRoot(this.containerRef.nativeElement);
    this.renderHelloComponent();
  }

  private renderHelloComponent(): void {
    if (!this.root || !this.HelloComponent) return;
    const cardElement = ReactService.createElement(this.HelloComponent, {
      text: 'harsh ',
      name: 'harsh User',
    });
    this.root.render(cardElement);
  }

  ngOnDestroy() {
    if (this.root && typeof this.root.unmount === 'function') {
      this.root.unmount();
    }
  }
}
