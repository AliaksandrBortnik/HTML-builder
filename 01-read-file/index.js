const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, 'text.txt');
const rs = fs.createReadStream(filePath, 'utf-8');
rs.on('data', text => process.stdout.write(text));
