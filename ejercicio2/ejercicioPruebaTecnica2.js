const fs = require('fs');

function generateRandomNumbers(count) {
  const numbers = new Set();
  while (numbers.size < count) {
    const randomNum = Math.floor(Math.random() * (2 ** 32));
    numbers.add(randomNum);
  }
  return Array.from(numbers);
}

function saveToFile(filename, data) {
  const stream = fs.createWriteStream(filename);
  data.forEach(num => stream.write(num + '\n'));
  stream.end();
}

const startTime = Date.now();
const numbers = generateRandomNumbers(5000000);
saveToFile('random_numbers.txt', numbers);
const endTime = Date.now();

console.log(`Tiempo total: ${ (endTime - startTime) } milisegundos`);
console.log(`Tiempo total: ${ (endTime - startTime) / 1000} segundos`);
