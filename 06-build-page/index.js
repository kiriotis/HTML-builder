console.clear();
const fs = require('fs');
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

    const componentFiles = fs.readdirSync(componentsFolderPath);
    let finalContent = templateContent;

    componentFiles.forEach((componentFile) => {
      const componentName = path.parse(componentFile).name;
      const componentContent = fs.readFileSync(
        path.join(componentsFolderPath, componentFile),
        'utf-8',
      );
      const componentTag = `{{${componentName}}}`;

      finalContent = finalContent.replace(componentTag, componentContent);
    });

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
  });
}

function compileStyles() {
  const cssFiles = fs
    .readdirSync(stylesFolderPath)
    .filter((file) => path.extname(file) === '.css');
  let cssContent = '';

  cssFiles.forEach((cssFile) => {
    cssContent += fs.readFileSync(
      path.join(stylesFolderPath, cssFile),
      'utf-8',
    );
  });

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

function copyAssetsFolder() {
  fs.mkdir(
    path.join(outputFolderPath, 'assets'),
    { recursive: true },
    (error) => {
      if (error) {
        console.error('Error creating assets folder:', error);
        return;
      }

      const assetFiles = fs.readdirSync(assetsFolderPath);
      assetFiles.forEach((assetFile) => {
        fs.mkdir(
          path.join(outputFolderPath, 'assets', assetFile),
          { recursive: true },
          (error) => {},
        );
      });
      assetFiles.forEach((assetFile) => {
        const sourceFilePath = path.join(assetsFolderPath, assetFile);
        const lowerFolderDir = fs.readdirSync(sourceFilePath);
        let newsourceFilePath;

        lowerFolderDir.forEach((el) => {
          newsourceFilePath = path.join(sourceFilePath, el);
          console.log(assetFile);
          const destinationFilePath = path.join(
            outputFolderPath,
            'assets',
            assetFile,
            el,
          );

          fs.copyFile(newsourceFilePath, destinationFilePath, (error) => {
            if (error) {
              console.error(`Error copying ${assetFile}:`, error);
              return;
            }

            console.log(`Copied ${assetFile} to assets folder.`);
          });
        });
      });
    },
  );
}

// Run the script
createProjectDistFolder();
