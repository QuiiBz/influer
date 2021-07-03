import influer from '.';

declare global {
  interface Window {
    influer: typeof influer
  }
}
