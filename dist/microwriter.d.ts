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
}
declare class Microwriter {
    /** An HTML element to write into */
    private _target;
    /** An array of strings to type */
    private _lines;
    /** A delay in milliseconds between typing new characters */
    private _writeSpeed;
    /** A delay in milliseconds between deletion of already typed characters */
    private _deleteSpeed;
    /** A delay between before typing the line */
    private _writeLineDelay;
    /** A delay between before deleting the line */
    private _deleteLineDelay;
    /** Is microwriter writing new characters */
    private _isPaused;
    /** Is microwriter deleting already typed characters */
    private _isDeleting;
    /** The length of a currently written line */
    private _charsWrittenCount;
    /** The length of a currently written line */
    private _lineLength;
    /** Current timer ID */
    private _timerId;
    constructor(options: MicrowriterOptions);
    /**
     * Start writing lines.
     */
    start(): void;
    /**
     * Pause writing lines.
     */
    pause(): void;
    /**
     * Replace lines array and restart the timer.
     *
     * @param lines - a new list of lines
     */
    replaceLines(lines: string[]): void;
    /**
     * Start timer.
     */
    private startTimer;
    /**
     * Stop timer.
     */
    private stopTimer;
    /**
     * Get a delay in ms depending on the current microwriter state.
     */
    private getDelay;
    /**
     * Reset microwriter state and restart the timer.
     */
    private reset;
    /**
     * Switch to the next line in the lines list.
     */
    private switchToNextLine;
    /**
     * Perform writing or deleting a character.
     */
    private tick;
}

export default Microwriter;
