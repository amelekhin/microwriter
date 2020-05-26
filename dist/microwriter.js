(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.microwriter = {}));
}(this, (function (exports) { 'use strict';

    const DEFAULT_WRITE_SPEED_MS = 200;
    class Microwriter {
        constructor(options) {
            /** Is microwriter writing new characters */
            this.isPaused = true;
            /** Is microwriter deleting already typed characters */
            this.isDeleting = false;
            /** The length of a currently written line */
            this.charsWritten = 0;
            /** The index of a currently written line */
            this.lineIndex = 0;
            /** Current timer ID */
            this.timerId = null;
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
        start() {
            this.isPaused = false;
            this.timerId = window.setTimeout(this.tick, this.delay);
        }
        /** Pause typing timer */
        pause() {
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
        replaceLines(lines) {
            this.pause();
            this.resetState();
            this.lines = lines.map(String);
            this.start();
        }
        /** Pause timer and reset current state  */
        resetState() {
            this.pause();
            this.isDeleting = false;
            this.lineIndex = 0;
            this.charsWritten = 0;
        }
        /** Get current line value */
        get currentLine() {
            return this.lines[this.lineIndex];
        }
        /** Get delay for next tick */
        get delay() {
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
        updateDirection() {
            const isLineBeginning = this.charsWritten === 0;
            const isLineEnd = this.charsWritten === this.currentLine.length;
            if (this.preserve || (isLineBeginning && this.isDeleting)) {
                this.isDeleting = false;
            }
            else if (isLineEnd && !this.isDeleting) {
                this.isDeleting = true;
            }
        }
        /** Calculate next charsWritten value before writing new content */
        updateCharsWritten() {
            const isLineBeginning = this.charsWritten === 0;
            const isLineEnd = this.charsWritten === this.currentLine.length;
            if (!isLineEnd && !this.isDeleting) {
                this.charsWritten += 1;
            }
            else if (!isLineBeginning && this.isDeleting && !this.preserve) {
                this.charsWritten -= 1;
            }
        }
        /** Update string in target element */
        updateText() {
            const nextInnerHtml = this.currentLine.substr(0, this.charsWritten);
            this.target.innerHTML = nextInnerHtml;
        }
        /** Switch to next line if necessary */
        setNextLine() {
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
        tick() {
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

    // This wrapper function is added to make it possible move to function-based implementation in future
    // without breaking the library interface and to make it compatible with 0.6 branch.
    function microwriter(options) {
        return new Microwriter(options);
    }

    exports.Microwriter = Microwriter;
    exports.default = microwriter;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=microwriter.js.map
