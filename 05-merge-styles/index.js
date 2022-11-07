const fs = require('fs');
const path = require('path');

const targetFolderName = 'project-dist';
const targetFileName = 'bundle.css';
const targetStream = fs.createWriteStream(
  path.join(__dirname, targetFolderName, targetFileName)
);

function isCssFileExt(fileName) {
  return path.extname(fileName) === '.css';
}

const sourceFolderPath = path.join(__dirname, 'styles');

fs.promises.readdir(sourceFolderPath, { withFileTypes: true })
  .then(dirEntries => {
    const cssFiles = dirEntries.filter(entry => entry.isFile() && isCssFileExt(entry.name));

    cssFiles.forEach(file =>
      fs.createReadStream(path.join(sourceFolderPath, file.name))
        .pipe(targetStream)
    );
  });

