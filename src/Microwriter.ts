interface MicrowriterOptions {
  /** An HTML element to write into */
  target: HTMLElement;

  /** An array of strings to type */
  lines: string[];

  /** A speed in milliseconds between typing new characters */
  writeSpeed: number;

  /** A speed in milliseconds between deletion of already typed characters */
  deleteSpeed: number;

  /** A delay between before typing the line */
  writeLineDelay: number;

  /** A delay between before deleting the line */
  deleteLineDelay: number;
}

const DEFAULT_WRITE_SPEED = 200;

export default class Microwriter {
  /** An HTML element to write into */
  private _target: HTMLElement;

  /** An array of strings to type */
  private _lines: string[];

  /** A delay in milliseconds between typing new characters */
  private _writeSpeed: number;

  /** A delay in milliseconds between deletion of already typed characters */
  private _deleteSpeed: number;

  /** A delay between before typing the line */
  private _writeLineDelay: number;

  /** A delay between before deleting the line */
  private _deleteLineDelay: number;

  /** Is microwriter writing new characters */
  private _isPaused = false;

  /** Is microwriter deleting already typed characters */
  private _isDeleting = false;

  /** The length of a currently written line */
  private _charsWrittenCount = 0;

  /** The length of a currently written line */
  private _lineLength = 0;

  /** Current timer ID */
  private _timerId = -1;

  public constructor(options: MicrowriterOptions) {
    this._target = options.target;
    this._lines = options.lines || [];
    this._writeSpeed = options.writeSpeed || DEFAULT_WRITE_SPEED;
    this._deleteSpeed = options.deleteSpeed || options.writeSpeed || DEFAULT_WRITE_SPEED;
    this._writeLineDelay = options.writeLineDelay || 0;
    this._deleteLineDelay = options.deleteLineDelay || 0;
  }

  /**
   * Start writing lines.
   */
  public start(): void {
    this._isPaused = false;
    this.startTimer();
  }

  /**
   * Pause writing lines.
   */
  public pause(): void {
    this._isPaused = true;
    this.stopTimer();
  }

  /**
   * Replace lines array and restart the timer.
   *
   * @param lines - a new list of lines
   */
  public replaceLines(lines: string[]): void {
    this._lines = lines;
    this.reset();
  }

  /**
   * Start timer.
   */
  private startTimer(): void {
    this._timerId = window.setTimeout(this.tick, this.getDelay());
  }

  /**
   * Stop timer.
   */
  private stopTimer(): void {
    window.clearTimeout(this._timerId);
  }

  /**
   * Get a delay in ms depending on the current microwriter state.
   */
  private getDelay(): number {
    const currentLine = this._lines[this._lineLength];

    // If writing a line is about to begin
    if (this._charsWrittenCount === 0) {
      return this._writeLineDelay || this._writeSpeed;
    }

    // If deleting a line is about to begin
    if (this._charsWrittenCount === currentLine.length) {
      return this._deleteLineDelay || this._deleteSpeed;
    }

    // If in the middle of deleting a line
    if (this._isDeleting) {
      return this._deleteSpeed;
    }

    // If in the middle of writing a line
    return this._writeSpeed;
  }

  /**
   * Reset microwriter state and restart the timer.
   */
  private reset(): void {
    this.stopTimer();

    this._isDeleting = false;
    this._lineLength = 0;
    this._charsWrittenCount = 0;

    this.startTimer();
  }

  /**
   * Switch to the next line in the lines list.
   */
  private switchToNextLine(): void {
    if (this._lineLength === this._lines.length - 1) {
      this._lineLength = 0;
      return;
    }

    this._lineLength++;
  }

  /**
   * Perform writing or deleting a character.
   */
  private tick = (): void => {
    if (this._isPaused) {
      return;
    }

    const currentLine = this._lines[this._lineLength];
    const currentLineLen = currentLine.length;

    if (this._charsWrittenCount < currentLineLen && !this._isDeleting) {
      this._charsWrittenCount += 1;
    } else if (this._charsWrittenCount > 0 && this._isDeleting) {
      this._charsWrittenCount -= 1;
    }

    const nextInnerHtml = currentLine.substr(0, this._charsWrittenCount);

    if (this._charsWrittenCount === 0 && this._isDeleting) {
      this._isDeleting = false;
      this.switchToNextLine();
    } else if (this._charsWrittenCount === currentLine.length && !this._isDeleting) {
      this._isDeleting = true;
    }

    this._target.innerHTML = nextInnerHtml;

    if (!this._isPaused) {
      this.startTimer();
    }
  };
}
