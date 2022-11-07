const DEV_MODE: boolean = true;

/** Debug tool
 */
class Debugger {
  dev: Boolean;
  constructor(isDevMode: boolean) {
    this.dev = isDevMode;
  }

  log(...data: any[]): void {
    this.dev && console.log(...data);
  }
  error(...data: any[]): void {
    this.dev && console.error(...data);
  }
  warn(...data: any[]): void {
    this.dev && console.warn(...data);
  }
  table(...data: any[]): void {
    this.dev && console.table(...data);
  }
}

const debug = new Debugger(DEV_MODE);
export { debug };
