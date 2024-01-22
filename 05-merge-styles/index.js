const fs = require('fs');
const path = require('path');

const stylesFolderPath = './05-merge-styles/styles';
const outputFolderPath = './05-merge-styles/project-dist';
const outputFile = path.join(outputFolderPath, 'bundle.css');

function compileStyles() {
  // Read the styles folder
  fs.readdir(stylesFolderPath, { withFileTypes: true }, (error, files) => {
    if (error) {
      console.error('Error reading styles folder:', error);
      return;
    }

    // Filter files with .css extension
    const cssFiles = files.filter(
      (file) => file.isFile() && path.extname(file.name) === '.css',
    );

    // Concatenate the content of all CSS files
    const cssContent = cssFiles
      .map((file) => {
        const filePath = path.join(stylesFolderPath, file.name);
        return fs.readFileSync(filePath, 'utf-8');
      })
      .join('\n');

    // Create the output folder if it doesn't exist
    fs.mkdir(outputFolderPath, { recursive: true }, (error) => {
      if (error) {
        console.error('Error creating output folder:', error);
        return;
      }

      // Write the compiled CSS content to the bundle.css file
      fs.writeFile(outputFile, cssContent, (error) => {
        if (error) {
          console.error('Error writing bundle.css file:', error);
          return;
        }

        console.log('Styles compiled successfully!');
      });
    });
  });
}

// Run the script
compileStyles();
