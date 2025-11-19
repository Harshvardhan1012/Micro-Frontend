export interface ComponentConfig {
  componentName: string;
  props: any;
  id: string;
  microfrontendName?: string;
}

export interface MicrofrontendConfig {
  name: string;
  url: string;
  scope: string;
}

export interface VirtualScrollConfig {
  itemHeight: number;
  containerHeight: number;
  bufferSize: number;
}
