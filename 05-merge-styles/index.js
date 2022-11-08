const fs = require('fs');
const path = require('path');

async function makeStyleBundle(targetFolderName, targetFileName) {
  const targetStream = fs.createWriteStream(
    path.join(__dirname, targetFolderName, targetFileName)
  );

  function isCssFileExt(fileName) {
    return path.extname(fileName) === '.css';
  }

  const sourceFolderPath = path.join(__dirname, 'styles');
  const dirEntries = await fs.promises.readdir(sourceFolderPath, { withFileTypes: true });
  const cssFiles = dirEntries.filter(entry => entry.isFile() && isCssFileExt(entry.name));

  cssFiles.forEach(file =>
    fs.createReadStream(path.join(sourceFolderPath, file.name))
      .pipe(targetStream)
  );
}

makeStyleBundle('project-dist', 'bundle.css');
