// open a connection to the database on our locally running instance of MongoDB
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/wikipedia')

// models
var Revert = require('../models/article.js').Revert

// get notified if we connect successfully or if a connection error occurs
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('Connected to MongoDB')
  Revert.remove({}, function(err) {
     console.log('Collection restarted')
     process.exit()
  })
})
