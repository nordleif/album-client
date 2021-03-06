
/**
 * Performs guid operations.
 */
export class Guid {

  /**
   * Returns an empty guid string.
   */
  public static readonly empty = '00000000-0000-0000-0000-000000000000';

  /**
   * Creates a new guid string.
   */
  public static newGuid() {

    // https://github.com/wulfsolter/angular2-uuid/blob/master/src/uuid.ts

    // tslint:disable-next-line:max-line-length
    if (typeof (window) !== 'undefined' && typeof (window.crypto) !== 'undefined' && typeof (window.crypto.getRandomValues) !== 'undefined') {
      const buf: Uint16Array = new Uint16Array(8);
      window.crypto.getRandomValues(buf);
      return (
          this.pad4(buf[0]) +
          this.pad4(buf[1]) + '-' +
          this.pad4(buf[2]) + '-' +
          this.pad4(buf[3]) + '-' +
          this.pad4(buf[4]) + '-' +
          this.pad4(buf[5]) +
          this.pad4(buf[6]) +
          this.pad4(buf[7])
        );
    } else {
      return this.random4() +
        this.random4() + '-' +
        this.random4() + '-' +
        this.random4() + '-' +
        this.random4() + '-' +
        this.random4() +
        this.random4() +
        this.random4();
    }
  }

  /** @hidden */
  private static pad4(num: number): string {
    let ret: string = num.toString(16);
    while (ret.length < 4) {
        ret = '0' + ret;
    }
    return ret;
  }

  /** @hidden */
  private static random4(): string {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
}
