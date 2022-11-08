const fs = require('fs');
const path = require('path');
const { mkdir, readdir, stat, rm, access, copyFile } = require('fs').promises;

const targetFolderName = 'project-dist';
const targetFolderPath = path.join(__dirname, targetFolderName);

async function deleteDir(path) {
  try {
    await access(path);
    await rm(path, { recursive: true });
  } catch(err) {
    // console.log('No folder found.');
  }
}

async function copyDir(from, to) {
  const copy = async (source, target) => {
    const dirEntries = await readdir(source);

    for (const entry of dirEntries) {
      const entryStat = await stat(path.resolve(source, entry));

      const currentSource = path.resolve(source, entry);
      const currentTarget = path.resolve(target, entry);

      if (entryStat.isFile()) {
        await copyFile(currentSource, currentTarget);
      }

      if (entryStat.isDirectory()) {
        await mkdir(currentTarget, { recursive: true });
        await copy(currentSource, currentTarget);
      }
    }
  };

  await deleteDir(to);
  await mkdir(to, { recursive: true });
  await copy(from, to);
}

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

async function buildIndexHtml() {
  let template = await fs.promises.readFile(path.join(__dirname, 'template.html'), 'utf-8');

  const componentFiles = await fs.promises.readdir(
    path.join(__dirname, 'components'),
    { withFileTypes: true }
  );

  for (const componentFile of componentFiles) {
    const componentTemplate = await fs.promises.readFile(
      path.join(__dirname, 'components', componentFile.name),
      'utf-8'
    );

    // Component name w/o file extension.
    const componentName = componentFile.name.split('.')[0];
    template = template.replace(`{{${componentName}}}`, componentTemplate);
    await fs.promises.writeFile(path.join(__dirname, targetFolderName, 'index.html'), template);
  }
}

async function copyAssets() {
  await copyDir(
    path.join(__dirname, 'assets'),
    path.join(__dirname, targetFolderName, 'assets')
  );
}

(async () => await deleteDir(targetFolderPath))();

fs.mkdir(targetFolderPath, async () => {
  await buildIndexHtml();
  await makeStyleBundle('project-dist', 'style.css');
  await copyAssets();
});