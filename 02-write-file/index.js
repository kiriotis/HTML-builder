const fs = require('fs');
const process = require('process');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to handle the termination of the process
function exitGracefully(farewellPhrase) {
  console.log(farewellPhrase);
  readline.close(); // close the readline interface
  process.exit(0); // exit the process with a success code
}

// Register the beforeExit event (Ctrl+C) handler
process.on('beforeExit', () => {
  exitGracefully('Thank you for using our service. Goodbye!');
});

// Main function that asks for the user's name
function kek() {
  readline.question(`What's your name? `, (name) => {
    if (name === 'exit') {
      exitGracefully('Thank you for using our service. Goodbye!');
      return;
    }

    fs.writeFile(
      './02-write-file/text.txt',
      name + '\n',
      { flag: 'a' },
      (err) => {
        if (err) {
          console.error('Error writing to file:', err);
          process.exit(1); // exit the process with an error code
        } else {
          console.log('File written successfully');
          kek(); // Prompt for the name again
        }
      },
    );
  });
}

// Call the main function
kek();
