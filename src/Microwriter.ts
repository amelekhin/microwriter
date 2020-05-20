interface MicrowriterOptions {
  /** An HTML element to write into */
  target: HTMLElement;

  /** An array of strings to type */
  lines: string[];

  /** A delay in milliseconds between typing new characters */
  writeDelay: number;

  /** A delay in milliseconds between deletion of already typed characters */
  deleteDelay: number;
}

export default class Microwriter {
  /** An HTML element to write into */
  private _target: HTMLElement;

  /** An array of strings to type */
  private _lines: string[];

  /** A delay in milliseconds between typing new characters */
  private _writeDelay: number;

  /** A delay in milliseconds between deletion of already typed characters */
  private _deleteDelay: number;

  /** Is microwriter writing new characters */
  private _isEnabled = false;

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
    this._writeDelay = options.writeDelay;
    this._deleteDelay = options.deleteDelay;
  }

  /** Enable or disable timer */
  public toggle(isTyping?: boolean): void {
    this._isEnabled = typeof isTyping === 'boolean' ? isTyping : !this._isEnabled;

    if (isTyping) {
      this.startTimer();
    } else {
      this.stopTimer();
    }
  }

  public replaceLines(nextLines: string[]): void {
    this._lines = nextLines;
    this.reset();
  }

  /** Start timer */
  private startTimer(): void {
    this._timerId = window.setTimeout(this.tick, this._isDeleting ? this._deleteDelay : this._writeDelay);
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
    if (!this._isEnabled) {
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

    if (this._isEnabled) {
      this.startTimer();
    }
  };
}
