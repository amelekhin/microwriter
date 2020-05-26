import microwriter from '../../dist/microwriter';

// Find a target element to write text into
const target = document.getElementById('microwriter-target');

// Initialize a writer
const writer = microwriter({
  // The target
  target,

  // The lines list
  lines: ['Hello, world', 'This is Microwriter'],

  // Print in infinite loop
  // Default is false
  loop: true,

  // Delete whole line at a time before writing next or preserve the line if there's only one in the list
  // Default is false
  preserve: false,

  // The writing speed in milliseconds
  writeSpeed: 150,

  // The deletion speed in milliseconds
  // If not provided, writeSpeed is used instead
  deleteSpeed: 50,

  // A delay in milliseconds before writing a new line
  writeLineDelay: 400,

  // A delay in milliseconds before deleting a written line
  deleteLineDelay: 1000,
});

// Start writing
writer.start();

// Pause writing
// writer.pause();

// Replace lines and restart
// writer.replaceLines(['My next list', 'of lines.']);
