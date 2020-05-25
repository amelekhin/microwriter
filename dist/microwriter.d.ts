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
    /** Preserve line text instead of deletion */
    preserve?: boolean;
}
interface MicrowriterInstance {
    /** Start timer */
    start(): void;
    /** Stop timer */
    pause(): void;
    /** Replace lines and restart timer */
    replaceLines(lines: string[]): void;
}
declare class Microwriter implements MicrowriterInstance {
    /** An HTML element to write into */
    private target;
    /** An array of strings to type */
    private lines;
    /** A speed in milliseconds between typing new characters */
    private writeSpeed;
    /** A speed in milliseconds between deletion of already typed characters */
    private deleteSpeed;
    /** A delay between before typing the line */
    private writeLineDelay;
    /** A delay between before deleting the line */
    private deleteLineDelay;
    /** Run in infinite loop */
    private loop?;
    /** Preserve line text instead of deletion */
    private preserve?;
    /** Is microwriter writing new characters */
    private isPaused;
    /** Is microwriter deleting already typed characters */
    private isDeleting;
    /** The length of a currently written line */
    private charsWritten;
    /** The index of a currently written line */
    private lineIndex;
    /** Current timer ID */
    private timerId;
    constructor(options: MicrowriterOptions);
    /** Start typing timer */
    start(): void;
    /** Pause typing timer */
    pause(): void;
    /**
     * Replace lines and restart timer.
     *
     * @param lines - a next list of lines
     */
    replaceLines(lines: string[]): void;
    /** Pause timer and reset current state  */
    private resetState;
    /** Get current line value */
    private get currentLine();
    /** Get delay for next tick */
    private get delay();
    /** Set direction (writing or deletion) for next tick */
    private updateDirection;
    /** Calculate next charsWritten value before writing new content */
    private updateCharsWritten;
    /** Update string in target element */
    private updateText;
    /** Switch to next line if necessary */
    private setNextLine;
    /** Perform a typing iteration */
    private tick;
}

export default Microwriter;
export { MicrowriterInstance, MicrowriterOptions };
