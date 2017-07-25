
const express = require('express');
const app = express();
const config = require('config');
const bodyParser = require('body-parser');

const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());
//app.use(cookieParser());

// Load routes
require('./routes')(app);

// Final catch error
app.use(function (err, req, res, next) {
  console.log('err', err);
  if (err === 'Invalid Request') {
    return res.status(400).send('Invalid Request.');
  }
  res.status(500).send('Internal Error.');
})

// Final catch non-errors
app.use(function (req, res, next) {
  res.status(200).end();
})

// Init server
app.listen(config.server.port, config.server.internalIP, () => {
  console.log(`Listening on port ${config.server.port} on internal IP: ${config.server.internalIP}.`);
});