const readline = require('readline');
const fs = require('fs');
const e = []
const rl = readline.createInterface({
  input: fs.createReadStream('10000-words.txt'),
});

rl.on('line', (line) => {
  console.log('Line from file:', line);
  e.push(line.replace(/\s\s+/g, ''));
});


rl.on("close", ()=>{
  fs.writeFile("./10000-words.json", JSON.stringify(e), (err)=>{})
})