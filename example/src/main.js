import Microwriter from '../../dist/microwriter';

const target = document.getElementById('microwriter-target');

const writer = new Microwriter({
  target,
  lines: ['Hello, world', 'This is Microwriter'],
  writeSpeed: 150,
  deleteSpeed: 50,
  writeLineDelay: 400,
  deleteLineDelay: 1000,
});

writer.start();
console.log(writer);
