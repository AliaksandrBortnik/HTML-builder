const path = require('path');
const { mkdir, readdir, copyFile, rm, access } = require('fs').promises;

async function deleteDir(path) {
  try {
    await access(path);
    await rm(path, { recursive: true });
  } catch(err) {
    console.log('No folder found.');
  }
}

async function copyDir(source, target) {
  await deleteDir(target);
  await mkdir(target, { recursive: true });

  const dirEntries = await readdir(source, { withFileTypes: true });
  const filesToCopy = dirEntries.filter(entry => entry.isFile());

  filesToCopy.forEach(({ name: fileName }) => copyFile(
    path.join(source, fileName),
    path.join(target, fileName)
  ));

  console.log('Copied successfully!');
}

copyDir(
  path.join(__dirname, 'files'),
  path.join(__dirname, 'files-copy')
);
