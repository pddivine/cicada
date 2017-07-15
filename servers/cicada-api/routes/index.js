const root = require('node-root.pddivine');
const v2 = require('value-validator.pddivine');
const langList = require(`${root}/assets/data/langList`);

const { WordModel } = require(root + '/model/mongo');

module.exports = function (webApp) {

  webApp.get('/cicada/client-info', (req, res, next) => {
    const userInformation = {
      ip:{
        determined: req.headers['x-forwarded-for'] || 
        req.connection.remoteAddress || 
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress,
        headers: {
          'x-forwarded-for': req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'] : null
        },
        connection: {
          remoteAddress: req.connection && req.connection.remoteAddress ? req.connection.remoteAddress : null,
          socket: req.connection && req.connection.socket ? req.connection.socket : null
        },
        socket: {
          remoteAddress: req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : null,
        }
      },
      headers: req.headers
    };
    return res.status(200).send(userInformation);
  });

  webApp.get('/cicada/words', getManyWords);
  webApp.post('/cicada/words', createManyWords);

  function getManyWords (req, res, next) {

    WordModel.find({}).exec()
    .then(data => {
      res.type('application/json');
      res.write(JSON.stringify(data));
      next();
    })
    .catch( err => {
      throw err;
    })
  }

  const argsSchema = {
    createManyWords: {
      type: Object,
      options: {
        required: true,
        allowNull: false,
        validation: undefined
      },
      schema: {
        words: {
          type: Array,
          options: {
            required: true,
            allowNull: false,
            validation: undefined
          },
          schema: {
            type: String,
            options: {
              required: true,
              allowNull: false,
              validation: undefined
            }
          }
        }
      }
    },
    createManyWords: {
      type: Object,
      options: {
        required: true,
        allowNull: false,
        validation: undefined
      },
      schema: {
        words: {
          type: Array,
          options: {
            required: true,
            allowNull: false,
            validation: undefined
          },
          schema: {
            type: String,
            options: {
              required: true,
              allowNull: false,
              validation: undefined
            }
          }
        },
        lang: {
          type: String,
          options: {
            required: true,
            allowNull: false,
            validation: (v) => {
              return !!langList[v];
            }
          }
        },
        notes: {
          type: String,
          options: {
            required: true,
            allowNull: false,
            validation: undefined
          }
        }
      }
    }
  }
  function createManyWords (req, res, next) {
    if ( !v2(req.body, argsSchema.createManyWords) ) {
      throw 'Invalid Request';
    }

    const { words, lang, notes } = req.body;

    Promise.all( words.map(word => {
      // See if exists
      return WordModel.findOneAndUpdate({ word, lang }, {$addToSet:{ notes }}, {new: true}).exec()
      
      .then(wordRes => {
        // If exists update
        if (wordRes) {
          return wordRes;
        }
        // Else create
        const w = new WordModel({
          word,
          lang,
          notes
        });
        return w.save();
      })
    }))
    .then(saveRes => {
      res.type('application/json');
      res.write(JSON.stringify(saveRes));
      return next();
    })
    .catch(err => {
      next(err);
    });
  }

};