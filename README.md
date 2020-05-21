# Microwriter [![npm][npm-shield]][npm-url] [![bundlephobia][bundlephobia-shield]][bundlephobia-url]

[npm-shield]: https://img.shields.io/npm/v/microwriter.svg?style=flat
[npm-url]: https://npmjs.org/package/microwriter
[bundlephobia-shield]: https://img.shields.io/bundlephobia/minzip/microwriter
[bundlephobia-url]: https://img.shields.io/bundlephobia/minzip/microwriter
[pikadev-url]: https://www.pika.dev/npm/microwriter

A tiny library that simulates the typewriter animation for JavaScript and TypeScript

## Installation

- Use pre-compiled modules in the `dist/` directory.
- Use [pika.dev][pikadev-url] to import the module without bundling:

```javascript
import microwriter from 'https://cdn.pika.dev/microwriter@^0.5.0';

const writer = new Microwriter({ ... });
```

- Use npm or yarn:

```
$ npm install microwriter
```

## Example

A working example can be found in the `example/` directory. The usage is very straightforward:

```javascript
// Find a target element to write text into.
const target = document.getElementById('microwriter-target');

// Initialize a writer.
const writer = microwriter({
  // The target.
  target,

  // The lines list.
  // They are printed in infinite loop.
  lines: ['Hello, world', 'This is Microwriter'],

  // The writing speed in milliseconds.
  writeSpeed: 150,

  // The deletion speed in milliseconds.
  // If not provided, writeSpeed used instead.
  deleteSpeed: 50,

  // A delay in milliseconds before writing a new line.
  writeLineDelay: 400,

  // A delay in milliseconds before deleting a written line.
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
