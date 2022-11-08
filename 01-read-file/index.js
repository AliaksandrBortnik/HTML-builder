const path = require('path');
const fs = require('fs');
const { pipeline } = require('stream');

const filePath = path.join(__dirname, 'text.txt');

pipeline(
  fs.createReadStream(filePath, 'utf-8'),
  process.stdout,
  err => err && process.stdout.write(err.message)
);
