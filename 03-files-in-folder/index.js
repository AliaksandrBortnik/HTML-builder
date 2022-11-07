const fs = require('fs').promises;
const path = require('path');

const folderName = 'secret-folder';
const folderPath = path.join(__dirname, folderName);

fs.readdir(folderPath, { withFileTypes: true })
  .then(dirEntries => {
    dirEntries.forEach(entry => {
      if (entry.isFile()) {
        const filePath = path.join(folderPath, entry.name);

        fs.stat(filePath)
          .then((stats) => {
            const fileName = entry.name.slice(0, entry.name.lastIndexOf('.'));
            const fileExtension = path.extname(entry.name).slice(1);
            const fileSizeKB = (stats.size / 1024).toFixed(2);
            console.log(`${fileName}-${fileExtension}-${fileSizeKB}KB`);
          });
      }
    });
  });