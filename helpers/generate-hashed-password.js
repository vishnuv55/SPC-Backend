const bcrypt = require('bcrypt');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question('Enter the password : ', async (password) => {
  if (password.length < 6) {
    console.log('Enter a valid password'); // eslint-disable-line
  } else {
    const hashedPassword = await bcrypt.hash(password, 8);
    // eslint-disable-next-line
    console.log(`\nHashed Password is : ${hashedPassword}`);
  }
  readline.close();
});
