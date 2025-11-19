import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { BatchRenderer } from './batch-renderer';
import { ReactComponentRegistry } from './component-registry';
import { ReactService } from './react.service';
import { ComponentConfig, VirtualScrollConfig } from './types';
import { VirtualScrollManager } from './virtual-scroll-manager';

@Component({
  selector: 'app-react-multi-wrapper',
  template: `
    <div
      class="react-container-wrapper"
      #scrollContainer
      [style.height.px]="scrollConfig.containerHeight"
    >
      <div class="virtual-spacer" [style.height.px]="totalHeight"></div>
      <div class="visible-items-container" [style.transform]="translateY">
        <div
          *ngFor="let item of visibleComponents; trackBy: trackByFn"
          class="react-item"
          [style.height.px]="scrollConfig.itemHeight"
          [attr.data-component-id]="item.id"
        >
          <div
            #reactContainer
            [attr.data-component-id]="item.id"
            class="react-component-container"
          ></div>
          <div *ngIf="isLoading(item.id)" class="loading-indicator">
            Loading {{ item.componentName }}...
          </div>
          <div *ngIf="hasError(item.id)" class="error-indicator">
            Error loading {{ item.componentName }}
          </div>
        </div>
      </div>
    </div>
  `,
  imports: [CommonModule],
})
export class ReactMultiWrapperComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() components: ComponentConfig[] = [];
  @Input() scrollConfig: VirtualScrollConfig = {
    itemHeight: 200,
    containerHeight: 600,
    bufferSize: 5,
  };
  @Input() enableVirtualScroll: boolean = true;
  @Input() enableBatching: boolean = true;
  @Input() batchSize: number = 10;

  @ViewChild('scrollContainer', { static: true })
  scrollContainerRef!: ElementRef<HTMLElement>;

  visibleComponents: ComponentConfig[] = [];
  private roots = new Map<string, any>();
  private loadingStates = new Map<string, boolean>();
  private errorStates = new Map<string, boolean>();
  private virtualScrollManager?: VirtualScrollManager;

  // Virtual scroll properties
  totalHeight = 0;
  translateY = 'translateY(0px)';

  private cdr = inject(ChangeDetectorRef);

  async ngOnInit() {
    // Initialize React service
    await ReactService.initialize();

    if (this.enableVirtualScroll) {
      this.setupVirtualScroll();
    } else {
      this.visibleComponents = [...this.components];
    }

    // Preload components
    if (this.components.length > 0) {
      await ReactComponentRegistry.preloadComponents(this.components);
    }
    console.log(this.components);
  }

  ngAfterViewInit() {
    if (this.enableVirtualScroll && this.virtualScrollManager) {
      this.virtualScrollManager.initialize(this.scrollContainerRef.nativeElement);
    }

    // Start rendering visible components
    this.renderVisibleComponents();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['components'] && !changes['components'].firstChange) {
      this.updateComponents(changes['components'].currentValue);
    }
  }

  ngOnDestroy() {
    this.cleanupAllComponents();
    this.virtualScrollManager?.destroy();
  }

  private setupVirtualScroll(): void {
    this.totalHeight = this.components.length * this.scrollConfig.itemHeight;
    debugger;
    this.virtualScrollManager = new VirtualScrollManager(
      this.scrollConfig,
      this.components,
      (visibleItems, startIndex) => {
        this.visibleComponents = visibleItems;
        this.translateY = `translateY(${startIndex * this.scrollConfig.itemHeight}px)`;
        this.cdr.detectChanges();
        debugger;
        console.log('Visible items updated:', visibleItems);
        console.log(this.translateY);

        // Render newly visible components
        this.renderVisibleComponents();
      }
    );
  }

  private async updateComponents(newComponents: ComponentConfig[]): Promise<void> {
    this.components = newComponents;

    if (this.enableVirtualScroll) {
      this.totalHeight = this.components.length * this.scrollConfig.itemHeight;
      this.virtualScrollManager?.updateItems(this.components);
    } else {
      this.visibleComponents = [...this.components];
      this.renderVisibleComponents();
    }

    // Preload new components
    await ReactComponentRegistry.preloadComponents(newComponents);
  }

  private async renderVisibleComponents(): Promise<void> {
    if (!ReactService.isReady()) return;

    const renderFunction = async (config: ComponentConfig) => {
      await this.renderSingleComponent(config);
    };

    if (this.enableBatching) {
      await BatchRenderer.batchRenderComponents(
        this.visibleComponents,
        renderFunction,
        this.batchSize
      );
    } else {
      // Render all at once
      const renderPromises = this.visibleComponents.map((config) => renderFunction(config));
      await Promise.all(renderPromises);
    }
  }

  private async renderSingleComponent(config: ComponentConfig): Promise<void> {
    try {
      // Skip if already rendered
      if (this.roots.has(config.id)) {
        return;
      }

      this.setLoading(config.id, true);

      // Find container element
      const container = this.scrollContainerRef.nativeElement.querySelector(
        `[data-component-id="${config.id}"] .react-component-container`
      );

      if (!container) {
        console.warn(`Container not found for component ${config.id}`);
        return;
      }

      // Load the component
      const Component = await ReactComponentRegistry.loadComponent(
        config.componentName,
        config.microfrontendName
      );

      console.log(Component, '--------------------');

      // Create React root using ReactService
      const root = ReactService.createReactRoot(container as HTMLElement);
      this.roots.set(config.id, root);

      // Render component using ReactService
      root.render(ReactService.createElement(Component, config.props));

      this.setLoading(config.id, false);
      this.setError(config.id, false);
    } catch (error) {
      console.error(`Failed to render component ${config.id}:`, error);
      this.setLoading(config.id, false);
      this.setError(config.id, true);
    }
  }

  private cleanupAllComponents(): void {
    for (const [id, root] of this.roots.entries()) {
      try {
        root.unmount();
      } catch (error) {
        console.warn(`Failed to unmount component ${id}:`, error);
      }
    }
    this.roots.clear();
    this.loadingStates.clear();
    this.errorStates.clear();
  }

  private setLoading(id: string, isLoading: boolean): void {
    this.loadingStates.set(id, isLoading);
  }

  private setError(id: string, hasError: boolean): void {
    this.errorStates.set(id, hasError);
  }

  isLoading(id: string): boolean {
    return this.loadingStates.get(id) || false;
  }

  hasError(id: string): boolean {
    return this.errorStates.get(id) || false;
  }

  trackByFn(index: number, item: ComponentConfig): string {
    return item.id;
  }

  // Public API methods
  scrollToComponent(componentId: string): void {
    const index = this.components.findIndex((c) => c.id === componentId);
    if (index !== -1 && this.virtualScrollManager) {
      this.virtualScrollManager.scrollToIndex(index);
    }
  }

  refreshComponent(componentId: string): void {
    const root = this.roots.get(componentId);
    if (root) {
      root.unmount();
      this.roots.delete(componentId);

      const config = this.components.find((c) => c.id === componentId);
      if (config) {
        this.renderSingleComponent(config);
      }
    }
  }

  getComponentStats(): { total: number; rendered: number; loading: number; errors: number } {
    return {
      total: this.components.length,
      rendered: this.roots.size,
      loading: Array.from(this.loadingStates.values()).filter(Boolean).length,
      errors: Array.from(this.errorStates.values()).filter(Boolean).length,
    };
  }
}
