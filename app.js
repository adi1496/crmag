// Core modules
const express = require('express');

// 3rd-party modules

// Own modules

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Welcome to the CRMag app');
});

module.exports = app;
