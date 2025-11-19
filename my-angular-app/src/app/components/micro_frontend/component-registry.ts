import { ComponentConfig } from './types';

export class ReactComponentRegistry {
  private static components = new Map<string, any>();
  private static loadingPromises = new Map<string, Promise<any>>();
  private static remoteLoadPromises = new Map<string, Promise<void>>();

  static async loadComponent(
    componentName: string,
    microfrontendName: string = 'hostApp'
  ): Promise<any> {
    const key = `${microfrontendName}/${componentName}`;
    // console.log(`Loading component: ${key}`);

    // Return cached component
    if (this.components.has(key)) {
      return this.components.get(key);
    }

    // Return existing loading promise
    if (this.loadingPromises.has(key)) {
      return this.loadingPromises.get(key);
    }

    // Ensure remote is loaded first
    await this.ensureRemoteLoaded(microfrontendName);

    // Create new loading promise
    const loadingPromise = await this.loadComponentInternal(key, microfrontendName, componentName);
    this.loadingPromises.set(key, loadingPromise);

    try {
      const component = await loadingPromise;
      debugger;
      console.log(component);
      this.components.set(key, component);
      this.loadingPromises.delete(key);
      return component;
    } catch (error) {
      this.loadingPromises.delete(key);
      throw error;
    }
  }

  private static async ensureRemoteLoaded(microfrontendName: string): Promise<void> {
    if (this.remoteLoadPromises.has(microfrontendName)) {
      return this.remoteLoadPromises.get(microfrontendName);
    }

    const remotePromise = this.loadRemoteContainer(microfrontendName);
    this.remoteLoadPromises.set(microfrontendName, remotePromise);

    try {
      await remotePromise;
    } catch (error) {
      this.remoteLoadPromises.delete(microfrontendName);
      throw error;
    }
  }

  private static async loadRemoteContainer(microfrontendName: string): Promise<void> {
    try {
      // Get the remote URL from webpack configuration
      const remoteUrl = this.getRemoteUrl(microfrontendName);

      if (!remoteUrl) {
        throw new Error(`No remote URL configured for ${microfrontendName}`);
      }

      // Check if remote is already loaded
      if (
        (window as any).__webpack_require__ &&
        (window as any).__webpack_require__.cache &&
        Object.keys((window as any).__webpack_require__.cache).some((key) =>
          key.includes(microfrontendName)
        )
      ) {
        console.log(`Remote ${microfrontendName} already loaded`);
        return;
      }

      // Load the remote entry script
      await this.loadScript(remoteUrl);

      // Wait a moment for the remote to initialize
      await new Promise((resolve) => setTimeout(resolve, 100));

      console.log(`Remote ${microfrontendName} loaded successfully`);
    } catch (error) {
      console.error(`Failed to load remote ${microfrontendName}:`, error);
      throw new Error(
        `Remote ${microfrontendName} could not be loaded: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  private static getRemoteUrl(microfrontendName: string): string | null {
    // Define your remote URLs here
    const remoteUrls: Record<string, string> = {
      hostApp: 'http://localhost:3001/remoteEntry.js',
      reactHello: 'http://localhost:3001/remoteEntry.js',
    };

    return remoteUrls[microfrontendName] || null;
  }

  private static loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if script already exists
      const existingScript = document.querySelector(`script[src="${url}"]`);
      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = url;
      script.type = 'text/javascript';
      script.async = true;

      script.onload = () => {
        console.log(`Script loaded: ${url}`);
        resolve();
      };

      script.onerror = (error) => {
        console.error(`Failed to load script: ${url}`, error);
        reject(new Error(`Failed to load remote script: ${url}`));
      };

      document.head.appendChild(script);
    });
  }

  private static async loadComponentInternal(
    key: string,
    microfrontendName: string,
    componentName: string
  ): Promise<any> {
    try {
      // Dynamic import based on microfrontend and component name
      //   const [module] = await Promise.all([
      //     import(`${microfrontendName}/${componentName}`),
      //   ]);
      //   console.log(`Component ${key} loaded successfully`);
      debugger;
      //   const newModule = await import(key);
      const module = await import('hostApp/HelloComponent');
      debugger;
      console.log(module);
      return module.HelloComponent || module;
    } catch (error) {
      debugger;
      console.error(`Failed to load component ${key}:`, error);
      throw new Error(
        `Component ${key} could not be loaded: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  static clearCache(): void {
    this.components.clear();
    this.loadingPromises.clear();
    this.remoteLoadPromises.clear();
  }

  static getCacheSize(): number {
    return this.components.size;
  }

  static preloadComponents(configs: ComponentConfig[]): Promise<(any | null)[]> {
    const uniqueComponents = new Map<string, ComponentConfig>();

    // Get unique component configurations
    configs.forEach((config) => {
      const key = `${config.microfrontendName}/${config.componentName}`;
      if (!uniqueComponents.has(key)) {
        uniqueComponents.set(key, config);
      }
    });

    // Preload all unique components
    const preloadPromises = Array.from(uniqueComponents.values()).map((config) =>
      this.loadComponent(config.componentName, config.microfrontendName).catch((error) => {
        console.warn(`Failed to preload component ${config.componentName}:`, error);
        return null;
      })
    );

    return Promise.all(preloadPromises);
  }

  static getRemoteStatus(): Record<string, boolean> {
    const status: Record<string, boolean> = {};
    for (const remoteName of this.remoteLoadPromises.keys()) {
      status[remoteName] = this.remoteLoadPromises.has(remoteName);
    }
    return status;
  }
}
