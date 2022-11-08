const fs = require('fs');
const path = require('path');

async function makeStyleBundle(targetFolderName, targetFileName) {
  const targetStream = fs.createWriteStream(
    path.join(__dirname, targetFolderName, targetFileName),
    'utf-8'
  );

  function isCssFileExt(fileName) {
    return path.extname(fileName) === '.css';
  }

  const sourceFolderPath = path.join(__dirname, 'styles');
  const dirEntries = await fs.promises.readdir(sourceFolderPath, { withFileTypes: true });
  const cssFiles = dirEntries.filter(entry => entry.isFile() && isCssFileExt(entry.name));

  for (const file of cssFiles) {
    const content = await fs.promises.readFile(path.join(sourceFolderPath, file.name), 'utf-8');
    targetStream.write(`${content}\n`);
  }
}

makeStyleBundle('project-dist', 'bundle.css');
