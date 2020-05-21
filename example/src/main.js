import microwriter from '../../dist/microwriter';

// Find a target element to write text into
const target = document.getElementById('microwriter-target');

// Initialize a writer
const writer = microwriter({
  // The target
  target,

  // The lines list.
  // They are printend in infinite loop.
  lines: ['Hello, world', 'This is Microwriter'],

  // The writing speed in milliseconds.
  writeSpeed: 150,

  // The deletion speed milliseconds.
  // If not provided, writeSpeed used instead.
  deleteSpeed: 50,

  // A delay in milliseconds before writing a new line
  writeLineDelay: 400,

  // A delay in milliseconds before deletion a written line
  deleteLineDelay: 1000,
});

// Start writing
writer.start();

// Pause writing
// writer.pause();

// Replace lines and restart
writer.replaceLines(['My next list', 'of lines.']);
