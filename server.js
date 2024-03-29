const express = require('express');
const appName = process.env.npm_package_name;
const path = require('path');
const app = express();

// Serve static files....
app.use(express.static(__dirname + `/dist/${appName}`));

// Send all requests to index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + `/dist/${appName}/index.html`));
});

// default Heroku PORT
app.listen(process.env.PORT || 3000, () => {
    console.log('App started');
});