(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.microwriter = factory());
}(this, (function () { 'use strict';

    const DEFAULT_WRITE_SPEED = 200;
    class Microwriter {
        constructor(options) {
            /** Is microwriter writing new characters */
            this._isPaused = false;
            /** Is microwriter deleting already typed characters */
            this._isDeleting = false;
            /** The length of a currently written linez */
            this._charsWrittenCount = 0;
            /** The length of a currently written linez */
            this._lineLength = 0;
            /** Current timer ID */
            this._timerId = -1;
            /**
             * Perform writing or deleting a character.
             */
            this.tick = () => {
                if (this._isPaused) {
                    return;
                }
                const currentLine = this._lines[this._lineLength];
                const currentLineLen = currentLine.length;
                if (this._charsWrittenCount < currentLineLen && !this._isDeleting) {
                    this._charsWrittenCount += 1;
                }
                else if (this._charsWrittenCount > 0 && this._isDeleting) {
                    this._charsWrittenCount -= 1;
                }
                const nextInnerHtml = currentLine.substr(0, this._charsWrittenCount);
                if (this._charsWrittenCount === 0 && this._isDeleting) {
                    this._isDeleting = false;
                    this.switchToNextLine();
                }
                else if (this._charsWrittenCount === currentLine.length && !this._isDeleting) {
                    this._isDeleting = true;
                }
                this._target.innerHTML = nextInnerHtml;
                if (!this._isPaused) {
                    this.startTimer();
                }
            };
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
        start() {
            this._isPaused = false;
            this.startTimer();
        }
        /**
         * Pause writing lines.
         */
        pause() {
            this._isPaused = true;
            this.stopTimer();
        }
        /**
         * Replace lines array and restart the timer.
         *
         * @param lines - a new list of lines
         */
        replaceLines(lines) {
            this._lines = lines;
            this.reset();
        }
        /**
         * Start timer.
         */
        startTimer() {
            this._timerId = window.setTimeout(this.tick, this.getDelay());
        }
        /**
         * Stop timer.
         */
        stopTimer() {
            window.clearTimeout(this._timerId);
        }
        /**
         * Get a delay in ms depending on the current microwriter state.
         */
        getDelay() {
            const currentLine = this._lines[this._lineLength];
            // If writing a line is about to begin
            if (this._charsWrittenCount === 0) {
                return this._writeLineDelay || this._writeSpeed;
            }
            // If deleting a line is about to begin
            if (this._charsWrittenCount === currentLine.length) {
                return this._writeLineDelay || this._writeSpeed;
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
        reset() {
            this.stopTimer();
            this._isDeleting = false;
            this._lineLength = 0;
            this._charsWrittenCount = 0;
            this.startTimer();
        }
        /**
         * Switch to the next line in the lines list.
         */
        switchToNextLine() {
            if (this._lineLength === this._lines.length - 1) {
                this._lineLength = 0;
                return;
            }
            this._lineLength++;
        }
    }

    return Microwriter;

})));
//# sourceMappingURL=microwriter.umd.js.map
