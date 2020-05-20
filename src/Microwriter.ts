interface MicrowriterOptions {
  /** An HTML element to write into */
  target: HTMLElement;

  /** An array of strings to type */
  lines: string[];

  /** A speed in milliseconds between typing new characters */
  writeSpeed: number;

  /** A speed in milliseconds between deletion of already typed characters */
  deleteSpeed: number;
}

export default class Microwriter {
  /** An HTML element to write into */
  private _target: HTMLElement;

  /** An array of strings to type */
  private _lines: string[];

  /** A delay in milliseconds between typing new characters */
  private _writeSpeed: number;

  /** A delay in milliseconds between deletion of already typed characters */
  private _deleteSpeed: number;

  /** Is microwriter writing new characters */
  private _isPaused = false;

  /** Is microwriter deleting already typed characters */
  private _isDeleting = false;

  /** Current character index of a current line */
  private _charIndex = 0;

  /** Current line index */
  private _lineIndex = 0;

  /** Current timer ID */
  private _timerId = -1;

  constructor(options: MicrowriterOptions) {
    this._target = options.target;
    this._lines = options.lines;
    this._writeSpeed = options.writeSpeed;
    this._deleteSpeed = options.deleteSpeed;
  }

  /** Enable or disable timer */
  public toggle(isPaused?: boolean): void {
    this._isPaused = typeof isPaused === 'boolean' ? isPaused : !this._isPaused;

    if (isPaused) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }

  public start(): void {
    this._isPaused = false;
    this.startTimer();
  }

  public pause(): void {
    this._isPaused = true;
    this.stopTimer();
  }

  public replaceLines(nextLines: string[]): void {
    this._lines = nextLines;
    this.reset();
  }

  /** Start timer */
  private startTimer(): void {
    this._timerId = window.setTimeout(this.tick, this._isDeleting ? this._deleteSpeed : this._writeSpeed);
  }

  /** Stop timer */
  private stopTimer(): void {
    window.clearTimeout(this._timerId);
  }

  private reset(): void {
    this.stopTimer();

    this._isDeleting = false;
    this._lineIndex = 0;
    this._charIndex = 0;

    this.startTimer();
  }

  private changeLine(): void {
    if (this._lineIndex === this._lines.length - 1) {
      this._lineIndex = 0;
      return;
    }

    this._lineIndex++;
  }

  /** Performa tick */
  private tick = (): void => {
    if (this._isPaused) {
      return;
    }

    const currentLine = this._lines[this._lineIndex];

    if (this._charIndex < currentLine.length + 1 && !this._isDeleting) {
      this._charIndex += 1;
    } else if (this._charIndex > -1 && this._isDeleting) {
      this._charIndex -= 1;
    }

    const nextInnerHtml = currentLine.substr(0, this._charIndex);

    if (this._charIndex === 0 && this._isDeleting) {
      this._isDeleting = false;
      this.changeLine();
    } else if (this._charIndex === currentLine.length && !this._isDeleting) {
      this._isDeleting = true;
    }

    this._target.innerHTML = nextInnerHtml;

    if (!this._isPaused) {
      this.startTimer();
    }
  };
}
