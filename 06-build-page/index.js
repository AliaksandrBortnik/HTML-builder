const fs = require('fs');
const path = require('path');
const copyDir = require('../04-copy-directory');
const makeStyleBundle = require('../05-merge-styles');

const targetFolderName = 'project-dist';

async function buildIndexHtml() {
  let template = await fs.promises.readFile(path.join(__dirname, 'template.html'), 'utf-8');

  const componentFiles = await fs.promises.readdir(
    path.join(__dirname, 'components'),
    { withFileTypes: true }
  );

  componentFiles.forEach(componentFile => {
    fs.readFile(path.join(__dirname, 'components', componentFile.name), 'utf-8', (err, componentTemplate) => {
      if (err) throw err;

      // Component name w/o file extension.
      const componentName = componentFile.name.split('.')[0];
      template = template.replace(`{{${componentName}}}`, componentTemplate);
      fs.promises.writeFile(path.join(__dirname, targetFolderName, 'index.html'), template, () => {});
    });
  });
}

async function copyAssets() {
  await copyDir(
    path.join(__dirname, 'assets'),
    path.join(__dirname, targetFolderName, 'assets')
  );
}

fs.mkdir(path.join(__dirname, targetFolderName), async () => {
  await buildIndexHtml();
  await makeStyleBundle('project-dist', 'style.css');
  await copyAssets();
});