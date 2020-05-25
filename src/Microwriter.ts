export interface MicrowriterOptions {
  /** An HTML element to write into */
  target: HTMLElement;

  /** An array of strings to type */
  lines: string[];

  /** A speed in milliseconds between typing new characters */
  writeSpeed: number;

  /** A speed in milliseconds between deletion of already typed characters */
  deleteSpeed?: number;

  /** A delay between before typing the line */
  writeLineDelay?: number;

  /** A delay between before deleting the line */
  deleteLineDelay?: number;

  /** Run in infinite loop */
  loop?: boolean;

  /** Preserve line text instead of deletion */
  preserve?: boolean;
}

export interface MicrowriterInstance {
  /** Start timer */
  start(): void;

  /** Stop timer */
  pause(): void;

  /** Replace lines and restart timer */
  replaceLines(lines: string[]): void;
}

const DEFAULT_WRITE_SPEED_MS = 200;

export default class Microwriter implements MicrowriterInstance {
  /** An HTML element to write into */
  private target: HTMLElement;

  /** An array of strings to type */
  private lines: string[];

  /** A speed in milliseconds between typing new characters */
  private writeSpeed: number;

  /** A speed in milliseconds between deletion of already typed characters */
  private deleteSpeed: number;

  /** A delay between before typing the line */
  private writeLineDelay: number;

  /** A delay between before deleting the line */
  private deleteLineDelay: number;

  /** Run in infinite loop */
  private loop?: boolean;

  /** Preserve line text instead of deletion */
  private preserve?: boolean;

  /** Is microwriter writing new characters */
  private isPaused = true;

  /** Is microwriter deleting already typed characters */
  private isDeleting = false;

  /** The length of a currently written line */
  private charsWritten = 0;

  /** The index of a currently written line */
  private lineIndex = 0;

  /** Current timer ID */
  private timerId: number | null = null;

  public constructor(options: MicrowriterOptions) {
    const isValidTarget = options.target instanceof HTMLElement;
    if (!isValidTarget) {
      throw new Error('Microwriter: options.target is not an HTMLElement');
    }

    const isValidLines = Array.isArray(options.lines);
    if (!isValidLines) {
      throw new Error('Microwriter: options.lines is not an array');
    }

    // Copy options to prevent unexpected behavior by mutating the options object
    this.target = options.target;

    // Map lines' elements to strings for safety
    this.lines = options.lines.map(String);

    // Use default write speed if writeSpeed is not provided
    this.writeSpeed = options.writeSpeed || DEFAULT_WRITE_SPEED_MS;

    // Use this.writeSpeed if deleteSpeed is not provided
    this.deleteSpeed = options.deleteSpeed || this.writeSpeed;

    // Completely optional params so we set them to 0 by default
    this.writeLineDelay = options.writeLineDelay || 0;
    this.deleteLineDelay = options.deleteLineDelay || 0;

    // Loop is disabled by default
    // Lines are written and removed one by one without repetition
    this.loop = options.loop || false;

    // If preserve is true, then line is removed instantly
    // before writing a new one instead of one-by-one character removal.
    // If combined with loop = false, then last line is not removed at all.
    // TODO: Revisit this behavior.
    this.preserve = options.preserve;

    this.tick = this.tick.bind(this);
  }

  /** Start typing timer */
  public start(): void {
    this.isPaused = false;
    this.timerId = window.setTimeout(this.tick, this.delay);
  }

  /** Pause typing timer */
  public pause(): void {
    if (!this.timerId) {
      return;
    }

    window.clearTimeout(this.timerId);
    this.isPaused = true;
    this.timerId = null;
  }

  /**
   * Replace lines and restart timer.
   *
   * @param lines - a next list of lines
   */
  public replaceLines(lines: string[]): void {
    this.pause();
    this.resetState();

    this.lines = lines.map(String);
    this.start();
  }

  /** Pause timer and reset current state  */
  private resetState(): void {
    this.pause();

    this.isDeleting = false;
    this.lineIndex = 0;
    this.charsWritten = 0;
  }

  /** Get current line value */
  private get currentLine(): string {
    return this.lines[this.lineIndex];
  }

  /** Get delay for next tick */
  private get delay(): number {
    // If writing a line is about to begin
    if (this.charsWritten === 0) {
      return this.writeLineDelay || this.writeSpeed;
    }

    // If deleting a line is about to begin
    if (this.charsWritten === this.currentLine.length) {
      if (this.preserve) {
        return this.deleteLineDelay;
      }

      return this.deleteLineDelay || this.deleteSpeed;
    }

    // If in the middle of deleting a line
    if (this.isDeleting) {
      return this.deleteSpeed;
    }

    // If in the middle of writing a line
    return this.writeSpeed;
  }

  /** Set direction (writing or deletion) for next tick */
  private updateDirection(): void {
    const isLineBeginning = this.charsWritten === 0;
    const isLineEnd = this.charsWritten === this.currentLine.length;

    if (this.preserve || (isLineBeginning && this.isDeleting)) {
      this.isDeleting = false;
    } else if (isLineEnd && !this.isDeleting) {
      this.isDeleting = true;
    }
  }

  /** Calculate next charsWritten value before writing new content */
  private updateCharsWritten(): void {
    const isLineBeginning = this.charsWritten === 0;
    const isLineEnd = this.charsWritten === this.currentLine.length;

    if (!isLineEnd && !this.isDeleting) {
      this.charsWritten += 1;
    } else if (!isLineBeginning && this.isDeleting && !this.preserve) {
      this.charsWritten -= 1;
    }
  }

  /** Update string in target element */
  private updateText(): void {
    const nextInnerHtml = this.currentLine.substr(0, this.charsWritten);
    this.target.innerHTML = nextInnerHtml;
  }

  /** Switch to next line if necessary */
  private setNextLine(): void {
    const isLineBeginning = this.charsWritten === 0;
    const isLineEnd = this.charsWritten === this.currentLine.length;
    const isLastLine = this.lineIndex === this.lines.length - 1;

    // If in the middle of the line, keep it
    if (!isLineBeginning && !isLineEnd) {
      return;
    }

    if (isLastLine) {
      if (!this.loop) {
        this.pause();
        return;
      }

      if (isLineBeginning || this.preserve) {
        this.lineIndex = 0;
        return;
      }
    }

    if (isLineBeginning) {
      this.lineIndex += 1;
    }
  }

  /** Perform a typing iteration */
  private tick(): void {
    if (this.isPaused) {
      return;
    }

    this.updateCharsWritten();
    this.updateText();
    this.updateDirection();
    this.setNextLine();

    this.start();
  }
}
