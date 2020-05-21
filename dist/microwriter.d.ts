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
    /** Start timer */
    start(): void;
    /** Stop timer */
    pause(): void;
    /** Replace lines and restart timer */
    replaceLines(lines: string[]): void;
}
declare function microwriter(options: MicrowriterOptions): MicrowriterInstance;

export default microwriter;
