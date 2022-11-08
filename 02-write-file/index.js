const fs = require('fs');
const path = require('path');

const fileName = 'text.txt';
const filePath = path.join(__dirname, fileName);
const output = fs.createWriteStream(filePath, 'utf-8');

const endCommand = 'exit';
const endPhrase = 'Finish. Everything is done.';

const exit = () => {
  console.log(endPhrase);
  process.exit();
};

console.log('Please, enter any text you want.');

process.stdin.on('data', (text) => {
  if (text.toString().trim() === endCommand) {
    exit();
  }

  output.write(text);
});

// Exit on CTRL+C
process.stdin.on('SIGINT', () => process.emit('SIGINT'));
process.on('SIGINT', exit);
