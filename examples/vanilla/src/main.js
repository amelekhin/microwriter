import Microwriter from '../../../dist/microwriter';

const target = document.getElementById('microwriter-target');

const writer = new Microwriter({
  target,
  lines: ['Hello', 'World'],
  writeSpeed: 800,
  deleteSpeed: 50,
  writeLineDelay: 1000,
  deleteLineDelay: 1000,
});

writer.start();
console.log(writer);
