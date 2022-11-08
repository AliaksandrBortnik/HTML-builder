const path = require('path');
const { mkdir, readdir, stat, rm, access, copyFile } = require('fs').promises;

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

const sourceFolder = path.join(__dirname, 'files');
const targetFolder = path.join(__dirname, 'files-copy');

copyDir(sourceFolder, targetFolder);

module.exports = copyDir;