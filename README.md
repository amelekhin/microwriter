# Microwriter [![npm][npm-shield]][npm-url] [![bundlephobia][bundlephobia-shield]][bundlephobia-url]

[npm-shield]: https://img.shields.io/npm/v/microwriter.svg?style=flat
[npm-url]: https://npmjs.org/package/microwriter
[bundlephobia-shield]: https://img.shields.io/bundlephobia/minzip/microwriter
[bundlephobia-url]: https://img.shields.io/bundlephobia/minzip/microwriter

A tiny library that simulates the typewriter animation for JavaScript and TypeScript

## Installation

Use npm or yarn:

```
$ npm install microwriter
```

or use pre-compiled modules in the `dist/` directory.

## Example

A working example can be found in the `example/` directory. The usage is very straightforward:

```javascript
// Find a target element to write text into.
const target = document.getElementById('microwriter-target');

// Initialize a writer.
const writer = new Microwriter({
  // The target.
  target,

  // The lines list.
  // They are printend in infinite loop.
  lines: ['Hello, world', 'This is Microwriter'],

  // The writing speed in milliseconds.
  writeSpeed: 150,

  // The deletion speed milliseconds.
  // If not provided, writeSpeed used instead.
  deleteSpeed: 50,

  // A delay in milliseconds before writing a new line.
  writeLineDelay: 400,

  // A delay in milliseconds before deletion a written line.
  deleteLineDelay: 1000,
});

// Start writing.
writer.start();

// Pause writing.
writer.pause();

// Replace lines and restart.
writer.replaceLines(['My next list', 'of lines.']);
```

## License

MIT.
