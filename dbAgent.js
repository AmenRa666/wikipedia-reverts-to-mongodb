// open a connection to the database on our locally running instance of MongoDB
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/wikipedia')

// models
var Revert = require('./models/revert.js').Revert

// get notified if we connect successfully or if a connection error occurs
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('Connected to MongoDB')
})

const insertRevert = (revert, callback) => {
  Revert.create(revert, (err, obj) => {
    if (err) return handleError(err)
    else {
      // console.log('Revert saved!')
      process.nextTick(function(){
        callback(null, 'Revert Saved')
      })
      // cb(null, 'Revert Saved')
    }
  })
}

const findRevertsByArticleTitle = (articleTitle, cb) => {
  var query = {'articleTitle':articleTitle}
  Revert.find(query, (err, reverts) => {
    if (err) console.log(err);
    else cb(reverts)
  })
}

// EXPORTS
module.exports.findRevertsByArticleTitle = findRevertsByArticleTitle
