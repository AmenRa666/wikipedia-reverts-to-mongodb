// MODULES
const fs = require('fs')
const inspect = require('util').inspect
const time = require('node-tictoc')
const async = require('async')


// LOGIC
time.tic()
let idsFile = fs.readFileSync('ids.txt', 'utf-8').trim()
let ids = idsFile.split('\n')

let targetFile = 'langlinks.csv'
fs.appendFileSync(targetFile, 'id,langLinksCount\n')

let articleCount = 0

const countLanglinks = (id, cb) => {
  let langlinksCount = 0
  let buffer = '';
  let rs = fs.createReadStream('enwiki-latest-langlinks.sql');
  rs.on('data', (chunk) => {
    let lines = (buffer + chunk).split(/\r?\n/g);
    buffer = lines.pop();
    for (let i = 0; i < lines.length; ++i) {
      let line = lines[i].substr(lines[i].indexOf(',')+1)
      let str = "\\(" + id + ",'..',"
      let regex = new RegExp(str, "g")
      let matches = lines[i].match(regex) || []
      langlinksCount = langlinksCount + matches.length
    }
  });
  rs.on('end', () => {
    articleCount++
    fs.appendFileSync(targetFile, id + ',' + langlinksCount + '\n')
    console.log('Article count: ' + articleCount);
    console.log('Article ID: ' + id);
    console.log('Langlinks count: ' + langlinksCount);
    console.log('- - - - - - - - - -');
    cb(null, 'Count Langlinks')
    // console.log('ended on non-empty buffer: ' + inspect(buffer));
  });
}

async.eachSeries(
  ids,
  countLanglinks,
  (err, res) => {
    if (err) throw err
    else {
      console.log('- - - - - - - - - -');
      console.log('END');
      console.log('Elapsed time: ');
      time.toc()
    }
  }
)
