const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send('Welcome to the CRMag app');
});

module.exports = router;