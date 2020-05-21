/* eslint-disable @typescript-eslint/no-use-before-define */
const DEFAULT_WRITE_SPEED = 200;
function microwriter(options) {
    /** An HTML element to write into */
    const target = options.target;
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
    /** Is microwriter writing new characters */
    let isPaused = false;
    /** Is microwriter deleting already typed characters */
    let isDeleting = false;
    /** The length of a currently written line */
    let charsWrittenCount = 0;
    /** The length of a currently written line */
    let lineLength = 0;
    /** Current timer ID */
    let timerId = -1;
    function startTimer() {
        isPaused = false;
        timerId = window.setTimeout(tick, getDelay());
    }
    function stopTimer() {
        window.clearTimeout(timerId);
        isPaused = true;
        timerId = -1;
    }
    function switchToNextLine() {
        if (lineLength === lines.length - 1) {
            lineLength = 0;
            return;
        }
        lineLength++;
    }
    function replaceLines(nextLines) {
        lines = nextLines;
        reset();
    }
    function tick() {
        if (isPaused) {
            return;
        }
        const currentLine = lines[lineLength];
        const currentLineLen = currentLine.length;
        if (charsWrittenCount < currentLineLen && !isDeleting) {
            charsWrittenCount += 1;
        }
        else if (charsWrittenCount > 0 && isDeleting) {
            charsWrittenCount -= 1;
        }
        const nextInnerHtml = currentLine.substr(0, charsWrittenCount);
        if (charsWrittenCount === 0 && isDeleting) {
            isDeleting = false;
            switchToNextLine();
        }
        else if (charsWrittenCount === currentLine.length && !isDeleting) {
            isDeleting = true;
        }
        target.innerHTML = nextInnerHtml;
        if (!isPaused) {
            startTimer();
        }
    }
    function reset() {
        stopTimer();
        isDeleting = false;
        lineLength = 0;
        charsWrittenCount = 0;
        startTimer();
    }
    function getDelay() {
        const currentLine = lines[lineLength];
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

export default microwriter;
//# sourceMappingURL=microwriter.esm.js.map
