const fs = require('fs');
const path = require('path');

function listFilesInFolder(folderPath) {
  fs.readdir(folderPath, { withFileTypes: true }, (error, files) => {
    if (error) {
      console.error('Error reading folder:', error);
      return;
    }

    files.forEach((file) => {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const fileSize = fs.statSync(filePath).size;
        const fileType = path.extname(filePath);

        console.log('File:', file.name.split('.')[0]);
        console.log('Size:', fileSize, 'bytes');
        console.log('Type:', fileType);
        console.log('-------------------------');
      }
    });
  });
}

// Usage
const folderPath = './03-files-in-folder/secret-folder';
listFilesInFolder(folderPath);
