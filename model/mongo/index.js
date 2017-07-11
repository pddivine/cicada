const mongoose = require('mongoose');

// Establish mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/words', {
  useMongoClient: true
});

const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
const WordSchema = new Schema({
    word      : String,
    lang      : { type: String, default: 'eng' },
    notes     : []
});

const WordModel = mongoose.model('words', WordSchema);

module.exports = {
  WordModel
}