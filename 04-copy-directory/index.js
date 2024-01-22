const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

async function syncFilesFolder() {
  const originalFolderPath = './04-copy-directory/files';
  const copyFolderPath = './04-copy-directory/files-copy';

  try {
    // Create the 'files-copy' folder if it doesn't exist
    await fsPromises.mkdir(copyFolderPath, {recursive:true});

    // Get the list of files in the original folder
    const files = await fsPromises.readdir(originalFolderPath);

    // Loop through each file and copy it to the 'files-copy' folder
    for (const file of files) {
      const originalFilePath = path.join(originalFolderPath, file);
      const copyFilePath = path.join(copyFolderPath, file);

      await fsPromises.copyFile(originalFilePath, copyFilePath);
    }

    console.log('Files copied successfully!');
  } catch (error) {
    console.error('Error syncing files folder:', error);
  }
}

// Usage
syncFilesFolder();