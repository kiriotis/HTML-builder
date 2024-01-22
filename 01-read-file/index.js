const fs = require('fs');

// Read the entire file.
fs.createReadStream('./01-read-file/text.txt', 'utf8').on('data', (chunk) => {
  // Process the data chunk
  console.log(chunk);
});
