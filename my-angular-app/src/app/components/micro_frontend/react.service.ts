import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReactService {
  private static React: any = null;
  private static createRoot: any = null;
  private static isInitialized = false;
  private static initPromise: Promise<void> | null = null;

  /**
   * Initialize React and ReactDOM once and cache them
   */
  static async initialize(): Promise<void> {
    // If already initialized, return immediately
    if (this.isInitialized) {
      return Promise.resolve();
    }

    // If initialization is in progress, return the existing promise
    if (this.initPromise) {
      return this.initPromise;
    }

    // Start initialization
    this.initPromise = this.performInitialization();
    return await this.initPromise;
  }

  private static async performInitialization(): Promise<void> {
    try {
      console.log('Initializing React service...');

      // Load React module
      const reactModule = await import('react');
      this.React = (reactModule as any).default || reactModule;
      
      // Try to import the modern client entry first (React 18+)
      let reactDOMClientModule: any = null;

      try {
        reactDOMClientModule = await import('react-dom/client');
        if (reactDOMClientModule) {
          this.createRoot = reactDOMClientModule.createRoot;
          // console.log(this.cre);
        }
      } catch (e) {
        console.warn('react-dom/client import failed (not present or bundler issue):', e);
      }

      if (!this.React) {
        throw new Error('Failed to load React module');
      }

      this.isInitialized = true;
      this.initPromise = null;
    } catch (error) {
      console.error('Failed to initialize React service:', error);
      this.initPromise = null;
      throw error;
    }
  }

  /**
   * Create a fallback createRoot function for older React versions or import issues
   */
  private static createFallbackCreateRoot(reactDOMModule: any): any {
    return (container: HTMLElement) => {
      console.log('Using fallback createRoot implementation');

      // For older React versions or import issues, use render method
      if (reactDOMModule && reactDOMModule.render) {
        return {
          render: (element: any) => {
            reactDOMModule.render(element, container);
          },
          unmount: () => {
            if (reactDOMModule.unmountComponentAtNode) {
              reactDOMModule.unmountComponentAtNode(container);
            }
          },
        };
      }

      // Ultimate fallback - minimal implementation
      return {
        render: (element: any) => {
          console.warn('Using minimal render implementation');
          if (container) {
            container.innerHTML = '<div>React component placeholder</div>';
          }
        },
        unmount: () => {
          if (container) {
            container.innerHTML = '';
          }
        },
      };
    };
  }

  /**
   * Get React instance (must call initialize first)
   */
  static getReact(): any {
    if (!this.isInitialized || !this.React) {
      throw new Error('React service not initialized. Call ReactService.initialize() first.');
    }
    return this.React;
  }

  /**
   * Get createRoot function (must call initialize first)
   */
  static getCreateRoot(): any {
    if (!this.isInitialized) {
      throw new Error('React service not initialized. Call ReactService.initialize() first.');
    }
    if (!this.createRoot) {
      console.warn('createRoot not available, this may cause rendering issues');
      return null;
    }
    return this.createRoot;
  }

  /**
   * Create a React root for the given container
   */
  static createReactRoot(container: HTMLElement): any {
    const createRoot = this.getCreateRoot();
    if (!createRoot) {
      console.warn('createRoot not available, using fallback implementation');
      return this.createFallbackCreateRoot(container);
    }
    return createRoot(container);
  }

  /**
   * Create a React element using React.createElement
   */
  static createElement(component: any, props?: any, ...children: any[]): any {
    const React = this.getReact();
    return React.createElement(component, props, ...children);
  }

  /**
   * Check if React service is ready
   */
  static isReady(): boolean {
    return this.isInitialized && !!this.React;
  }

  /**
   * Get service status information
   */
  static getStatus(): {
    initialized: boolean;
    hasReact: boolean;
    hasCreateRoot: boolean;
    reactVersion?: string;
  } {
    return {
      initialized: this.isInitialized,
      hasReact: !!this.React,
      hasCreateRoot: !!this.createRoot,
      reactVersion: this.React?.version,
    };
  }

  /**
   * Reset the service (useful for testing or reinitialization)
   */
  static reset(): void {
    this.React = null;
    this.createRoot = null;
    this.isInitialized = false;
    this.initPromise = null;
    console.log('React service reset');
  }

  // Instance methods for dependency injection
  async initialize(): Promise<void> {
    return ReactService.initialize();
  }

  getReact(): any {
    return ReactService.getReact();
  }

  getCreateRoot(): any {
    return ReactService.getCreateRoot();
  }

  createReactRoot(container: HTMLElement): any {
    return ReactService.createReactRoot(container);
  }

  createElement(component: any, props?: any, ...children: any[]): any {
    return ReactService.createElement(component, props, ...children);
  }

  isReady(): boolean {
    return ReactService.isReady();
  }

  getStatus() {
    return ReactService.getStatus();
  }

  render(root: any, element: any) {
    root.render(element);
  }

  destroy(root: any) {
    root?.unmount?.();
  }
}
