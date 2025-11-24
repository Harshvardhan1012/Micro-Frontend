import { ComponentConfig } from './types';

export class ReactComponentRegistry {
  private static components = new Map<string, any>();
  private static loadingPromises = new Map<string, Promise<any>>();
  private static remoteLoadPromises = new Map<string, Promise<void>>();

  /** -------------------------------------------------------
   * PUBLIC: Load any component from any microfrontend
   * ------------------------------------------------------ */
  static async loadComponent(
    componentName: string,
    microfrontendName: string = 'hostApp'
  ): Promise<any> {
    const key = `${microfrontendName}/${componentName}`;

    // Already cached?
    if (this.components.has(key)) {
      debugger
      return this.components.get(key);
    }

    // Already loading?
    if (this.loadingPromises.has(key)) {
      debugger
      return this.loadingPromises.get(key);
    }

    // 1. Ensure remote entry loaded
    await this.ensureRemoteLoaded(microfrontendName);

    // 2. Create loading promise
    const promise = this.loadComponentInternal(key, microfrontendName, componentName);
    this.loadingPromises.set(key, promise);

    try {
      const component = await promise;
      this.components.set(key, component);
      this.loadingPromises.delete(key);
      return component;
    } catch (error) {
      this.loadingPromises.delete(key);
      throw error;
    }
  }

  /** -------------------------------------------------------
   * Ensure remoteEntry.js is loaded ONCE
   * ------------------------------------------------------ */
  private static async ensureRemoteLoaded(microfrontendName: string): Promise<void> {
    if (this.remoteLoadPromises.has(microfrontendName)) {
      return this.remoteLoadPromises.get(microfrontendName);
    }

    const promise = this.loadRemoteContainer(microfrontendName);
    this.remoteLoadPromises.set(microfrontendName, promise);

    try {
      await promise;
    } catch (error) {
      this.remoteLoadPromises.delete(microfrontendName);
      throw error;
    }
  }

  /** -------------------------------------------------------
   * Load remoteEntry.js dynamically
   * ------------------------------------------------------ */
  private static async loadRemoteContainer(microfrontendName: string): Promise<void> {
    const remoteUrl = this.getRemoteUrl(microfrontendName);

    if (!remoteUrl) {
      throw new Error(`No remote URL configured for ${microfrontendName}`);
    }

    // If script already loaded, skip
    if (document.querySelector(`script[src="${remoteUrl}"]`)) {
      return;
    }

    await this.loadScript(remoteUrl);

    // Give Webpack MF slight time to initialize
    await new Promise((resolve) => setTimeout(resolve, 80));

    console.log(`Remote loaded: ${microfrontendName}`);
  }

  /** -------------------------------------------------------
   * Resolve remote URLs
   * ------------------------------------------------------ */
  private static getRemoteUrl(microfrontendName: string): string | null {
    const remoteUrls: Record<string, string> = {
      hostApp: 'http://localhost:3001/remoteEntry.js',
      reactHello: 'http://localhost:3002/remoteEntry.js',
      reactDashboard: 'http://localhost:3003/remoteEntry.js',
    };

    return remoteUrls[microfrontendName] || null;
  }

  /** -------------------------------------------------------
   * Load script helper
   * ------------------------------------------------------ */
  private static loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;

      script.onload = () => resolve();
      script.onerror = () => reject(`Failed to load script: ${url}`);

      document.head.appendChild(script);
    });
  }

  /** -------------------------------------------------------
   * Core dynamic loader using Module Federation runtime
   * ------------------------------------------------------ */
  private static async loadComponentInternal(
    key: string,
    microfrontendName: string,
    componentName: string
  ): Promise<any> {
    try {
      /** IMPORTANT:
       *  Webpack runtime syntax:
       *  await __webpack_init_sharing__("default");
       *  await window[microfrontendName].init(__webpack_share_scopes__.default);
       *  const factory = await window[microfrontendName].get("./Component");
       */

      const container = (window as any)[microfrontendName];

      if (!container) {
        throw new Error(`Remote container '${microfrontendName}' not found`);
      }

      

      // Initialize MF sharing
      await __webpack_init_sharing__("default");
      await container.init(__webpack_share_scopes__.default);

      // Component exposed as "./HelloComponent" etc
      const factory = await container.get(`./${componentName}`);
      const Module = factory();
      // Module Federation sometimes wraps default
      debugger
      return Module?.default || Module;
    } catch (error) {
      console.error(`Error loading component ${key}:`, error);
      throw new Error(`Failed to load component ${key}`);
    }
  }

  /** -------------------------------------------------------
   * Utility Functions
   * ------------------------------------------------------ */
  static clearCache(): void {
    this.components.clear();
    this.loadingPromises.clear();
    this.remoteLoadPromises.clear();
  }

  static getCacheSize(): number {
    return this.components.size;
  }

  static preloadComponents(configs: ComponentConfig[]): Promise<any[]> {
    const unique = new Map<string, ComponentConfig>();

    configs.forEach((c) => {
      unique.set(`${c.microfrontendName}/${c.componentName}`, c);
    });

    return Promise.all(
      [...unique.values()].map((cfg) =>
        this.loadComponent(cfg.componentName, cfg.microfrontendName).catch(() => null)
      )
    );
  }

  static getRemoteStatus(): Record<string, boolean> {
    const result: Record<string, boolean> = {};
    for (const [key] of this.remoteLoadPromises.entries()) {
      result[key] = true;
    }
    return result;
  }
}
