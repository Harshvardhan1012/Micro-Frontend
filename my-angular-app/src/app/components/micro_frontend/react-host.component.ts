import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ReactComponentRegistry } from './component-registry';
import { ReactService } from './react.service';

@Component({
  selector: 'react-host',
  standalone: true,
  imports: [CommonModule],
  template: `<div #container></div>`,
})
export class ReactHostComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() componentName!: string;
  @Input() microfrontendName: string = 'hostApp';
  @Input() props: any = {};

  @ViewChild('container', { static: false }) containerRef!: ElementRef;

  private root: any = null;
  private componentRef: any = null;
  private hasInitialized = false;

  /** ----------------------------------------------------
   * INITIAL LOAD (after view exists)
   * --------------------------------------------------- */
  async ngAfterViewInit() {
    this.hasInitialized = true;
    await this.loadAndRender();
  }

  /** ----------------------------------------------------
   * RE-RENDER when @Input props change
   * --------------------------------------------------- */
  async ngOnChanges(changes: SimpleChanges) {
    if (!this.hasInitialized) return;

    // Only re-render if componentName, microfrontendName or props changed
    if (changes['props'] || changes['componentName'] || changes['microfrontendName']) {
      await this.loadAndRender();
    }
  }

  /** ----------------------------------------------------
   * Core loading + rendering logic
   * --------------------------------------------------- */
  private async loadAndRender() {
    if (!this.containerRef?.nativeElement) return;
    if (!this.componentName) return;

    // Load React component from registry
    this.componentRef = await ReactComponentRegistry.loadComponent(
      this.componentName,
      this.microfrontendName
    );

    // Ensure React is initialized and create root only once
    await ReactService.initialize();
    if (!this.root) {
      this.root = ReactService.createReactRoot(this.containerRef.nativeElement);
    }


    // Create React element with props
    const element = ReactService.createElement(this.componentRef, this.props);
    debugger
    // Render into Angular container
    if (this.root) {
      this.root.render(element);
    } else {
      // fallback for older react-dom render interface
      (this.root as any).render && (this.root as any).render(element);
    }
  }

  /** ----------------------------------------------------
   * Cleanup
   * --------------------------------------------------- */
  ngOnDestroy() {
    if (this.root) {
      if (typeof this.root.unmount === 'function') {
        this.root.unmount();
      } else if (typeof (this.root as any).render === 'function') {
        // best-effort unmount for older render APIs
        (this.root as any).render(null);
      }
      this.root = null;
    }
  }
}
