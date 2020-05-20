import Microwriter from '../../../dist/microwriter.umd';

const target = document.getElementById('microwriter-target');

const writer = new Microwriter({
  target,
  lines: ['Hello', 'World'],
  writeDelay: 200,
  deleteDelay: 50,
});

writer.toggle(true);

console.log(writer);
