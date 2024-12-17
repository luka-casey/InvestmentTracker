declare module 'yahoo-finance' {
    export function quote(options: { symbol: string, modules: string[] }): Promise<any>;
  }
  