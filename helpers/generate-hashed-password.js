/**
 *
 * Create new hashed password from input provided through command line
 *
 * @author Anandhakrishnan M
 * @github https://github.com/anandhakrishnanm
 *
 */

const bcrypt = require('bcrypt');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Reading password from console
readline.question('Enter the password : ', async (password) => {
  if (password.length < 6) {
    console.log('Enter a valid password'); // eslint-disable-line
  } else {
    // Hashing password
    const hashedPassword = await bcrypt.hash(password, 8);
    // Logging password to console
    console.log(`\nHashed Password is : ${hashedPassword}`); // eslint-disable-line
  }
  readline.close();
});
