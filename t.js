var words = require('an-array-of-english-words');

console.log(words.filter((d) => /fun/.test(d)));
