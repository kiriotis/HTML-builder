console.clear();
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const componentsFolderPath = './06-build-page/components';
const templateFilePath = './06-build-page/template.html';
const stylesFolderPath = './06-build-page/styles';
const assetsFolderPath = './06-build-page/assets';
const outputFolderPath = './06-build-page/project-dist';

function createProjectDistFolder() {
  fs.mkdir(outputFolderPath, { recursive: true }, (error) => {
    if (error) {
      console.error('Error creating project-dist folder:', error);
      return;
    }

    console.log('project-dist folder created successfully!');
    replaceTemplateTags();
  });
}

function replaceTemplateTags() {
  fs.readFile(templateFilePath, 'utf-8', (error, templateContent) => {
    if (error) {
      console.error('Error reading template.html file:', error);
      return;
    }

    fs.readdir(componentsFolderPath, (error, componentFiles) => {
      if (error) {
        console.error('Error reading components folder:', error);
        return;
      }

      let finalContent = templateContent;

      componentFiles.forEach((componentFile) => {
        const componentName = path.parse(componentFile).name;
        const componentFilePath = path.join(
          componentsFolderPath,
          componentFile,
        );

        fs.readFile(componentFilePath, 'utf-8', (error, componentContent) => {
          if (error) {
            console.error(`Error reading ${componentFile}:`, error);
            return;
          }

          const componentTag = `{{${componentName}}}`;
          finalContent = finalContent.replace(componentTag, componentContent);

          if (
            componentFiles.indexOf(componentFile) ===
            componentFiles.length - 1
          ) {
            writeFile(finalContent);
          }
        });
      });
    });
  });
}

function writeFile(finalContent) {
  fs.writeFile(
    path.join(outputFolderPath, 'index.html'),
    finalContent,
    'utf-8',
    (error) => {
      if (error) {
        console.error('Error writing index.html file:', error);
        return;
      }

      console.log('index.html file created successfully!');
      compileStyles();
    },
  );
}

function compileStyles() {
  fs.readdir(stylesFolderPath, (error, cssFiles) => {
    if (error) {
      console.error('Error reading styles folder:', error);
      return;
    }

    let cssContent = '';

    cssFiles.forEach((cssFile) => {
      if (path.extname(cssFile) === '.css') {
        const cssFilePath = path.join(stylesFolderPath, cssFile);

        fs.readFile(cssFilePath, 'utf-8', (error, cssFileContent) => {
          if (error) {
            console.error(`Error reading ${cssFile}:`, error);
            return;
          }

          cssContent += cssFileContent;

          if (cssFiles.indexOf(cssFile) === cssFiles.length - 1) {
            writeCSSFile(cssContent);
          }
        });
      }
    });
  });
}

function writeCSSFile(cssContent) {
  fs.writeFile(
    path.join(outputFolderPath, 'style.css'),
    cssContent,
    'utf-8',
    (error) => {
      if (error) {
        console.error('Error writing style.css file:', error);
        return;
      }

      console.log('style.css file created successfully!');
      copyAssetsFolder();
    },
  );
}
async function copyAssetsFolder() {
  try {
    await fsPromises.mkdir(path.join(outputFolderPath, 'assets'), {
      recursive: true,
    });
    const assetFiles = await fsPromises.readdir(assetsFolderPath);

    for (const assetFile of assetFiles) {
      await fsPromises.mkdir(path.join(outputFolderPath, 'assets', assetFile), {
        recursive: true,
      });
      const sourceFolderPath = path.join(assetsFolderPath, assetFile);
      const lowerFolderDir = await fsPromises.readdir(sourceFolderPath);

      for (const el of lowerFolderDir) {
        const sourceFilePath = path.join(sourceFolderPath, el);
        const destinationFilePath = path.join(
          outputFolderPath,
          'assets',
          assetFile,
          el,
        );
        await fsPromises.copyFile(sourceFilePath, destinationFilePath);
        console.log(`Copied ${assetFile} to assets folder.`);
      }
    }
  } catch (error) {
    console.error('Error copying assets:', error);
  }
}

// Run the script
createProjectDistFolder();
