exports.createRandomChars = (size) => {
  let charsNumbers = [33, 57];
  let letters = [65, 122];
  let asciiArray = [];
  let randomChars = [];

  const createAsciiArray = (array) => {
    for (let i = array[0]; i <= array[1]; i++) {
      asciiArray.push(i);
    }
  };

  createAsciiArray(charsNumbers);
  createAsciiArray(letters);

  for (let i = 0; i < size; i++) {
    randomChars.push(String.fromCharCode(asciiArray[Math.floor(Math.random() * (asciiArray.length - 1))]));
  }

  return randomChars.join('');
};
