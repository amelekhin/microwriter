/* eslint-disable @typescript-eslint/no-use-before-define */

interface MicrowriterOptions {
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
}

interface MicrowriterInstance {
  start(): void;
  pause(): void;
  replaceLines(lines: string[]): void;
}

const DEFAULT_WRITE_SPEED = 200;

export default function microwriter(options: MicrowriterOptions): MicrowriterInstance {
  /** An HTML element to write into */
  const target: HTMLElement = options.target;

  /** An array of strings to type */
  let lines = options.lines;

  /** A delay in milliseconds between typing new characters */
  const writeSpeed = options.writeSpeed || DEFAULT_WRITE_SPEED;

  /** A delay in milliseconds between deletion of already typed characters */
  const deleteSpeed = options.deleteSpeed || writeSpeed;

  /** A delay between before typing the line */
  const writeLineDelay = options.writeLineDelay || 0;

  /** A delay between before deleting the line */
  const deleteLineDelay = options.deleteLineDelay || 0;

  /** Run in infinite loop */
  const loop = options.loop;

  /** Is microwriter writing new characters */
  let isPaused = false;

  /** Is microwriter deleting already typed characters */
  let isDeleting = false;

  /** The length of a currently written line */
  let charsWrittenCount = 0;

  /** The index of a currently written line */
  let lineIndex = 0;

  /** Current timer ID */
  let timerId = -1;

  function startTimer(): void {
    isPaused = false;
    timerId = window.setTimeout(tick, getDelay());
  }

  function stopTimer(): void {
    window.clearTimeout(timerId);
    isPaused = true;
    timerId = -1;
  }

  function onLineEnd(): void {
    if (lineIndex === lines.length - 1 && !loop) {
      stopTimer();
      return;
    }

    switchToNextLine();
  }

  function switchToNextLine(): void {
    if (lineIndex === lines.length - 1) {
      lineIndex = 0;
      return;
    }

    lineIndex++;
  }

  function replaceLines(nextLines: string[]): void {
    lines = nextLines;
    reset();
    startTimer();
  }

  function tick(): void {
    if (isPaused) {
      return;
    }

    const currentLine = lines[lineIndex];
    const currentLineLen = currentLine.length;

    if (charsWrittenCount < currentLineLen && !isDeleting) {
      charsWrittenCount += 1;
    } else if (charsWrittenCount > 0 && isDeleting) {
      charsWrittenCount -= 1;
    }

    const nextInnerHtml = currentLine.substr(0, charsWrittenCount);

    if (charsWrittenCount === 0 && isDeleting) {
      isDeleting = false;
      onLineEnd();
    } else if (charsWrittenCount === currentLine.length && !isDeleting) {
      isDeleting = true;
    }

    target.innerHTML = nextInnerHtml;

    if (!isPaused) {
      startTimer();
    }
  }

  function reset(): void {
    stopTimer();

    isDeleting = false;
    lineIndex = 0;
    charsWrittenCount = 0;
  }

  function getDelay(): number {
    const currentLine = lines[lineIndex];

    // If writing a line is about to begin
    if (charsWrittenCount === 0) {
      return writeLineDelay || writeSpeed;
    }

    // If deleting a line is about to begin
    if (charsWrittenCount === currentLine.length) {
      return deleteLineDelay || deleteSpeed;
    }

    // If in the middle of deleting a line
    if (isDeleting) {
      return deleteSpeed;
    }

    // If in the middle of writing a line
    return writeSpeed;
  }

  return {
    start: startTimer,
    pause: stopTimer,
    replaceLines: replaceLines,
  };
}