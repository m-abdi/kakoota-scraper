import fs from 'fs';

import readline from "readline"

const rl = readline.createInterface({
  input: fs.createReadStream('./1000.txt'),
});

const output = []

rl.on('line', (line) => {
  console.log('Line from file:', line);
  output.push(line.replace(/\s\s+/g, ''));
});

rl.on("close", ()=>{
    fs.writeFile('./all-1000.txt', JSON.stringify(output), {}, (err) => {})
})