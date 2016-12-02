// MODULES
const fs = require('fs');
const inspect = require('util').inspect;
const Sync = require('sync');
// Database Agent
const dbAgent = require('../dbAgent.js')
// Models
const Revert = require('../models/revert.js')


// LOGIC
let previousLine = ''
let revertCount = 0

let j = 1
let articleCount = 1

let revert = {
  articleTitle: null,
  revertCount: null
}

let buffer = '';
let rs = fs.createReadStream('RevertedEditsEN.csv');
rs.on('data', (chunk) => {
  let lines = (buffer + chunk).split(/\r?\n/g);
  buffer = lines.pop();
  for (let i = 0; i < lines.length; ++i) {
    if (lines[i][0] != '#') {
      let line = lines[i].substr(lines[i].indexOf(',')+1)
      line = line.substr(line.indexOf(',')+1)
      line = line.substr(line.indexOf(',')+1)
      line = line.substr(line.indexOf(',')+1)
      line = line.substr(line.indexOf(',')+1)
      line = line.substr(0, line.indexOf(','))
      if (line == previousLine) {
        revertCount++
      }
      else if (line != previousLine && previousLine != '') {
        revert.articleTitle = previousLine
        revert.revertCount = revertCount

        Sync(function(){
          dbAgent.insertRevert.sync(null, revert)
        })

        previousLine = line
        revert.articleTitle = null
        revert.revertCount = null
        revertCount = 1
        articleCount++
      }
      else {
        previousLine = line
        revertCount = 1
      }
      console.log(j + ' Article: ' + line + ' - Line number: ' + articleCount);
      previousLine = line
      j++
    }
  }
});
rs.on('end', () => {
  // optionally process `buffer` here if you want to treat leftover data without
  // a newline as a "line"
  console.log('ended on non-empty buffer: ' + inspect(buffer));
});
