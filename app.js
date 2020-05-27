// Core modules
const express = require('express');
const morgan = require('morgan');

// 3rd-party modules

// Own modules
const viewRoutes = require('./routes/viewRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use('/api/v1/products', productRoutes);
app.use('/', viewRoutes);

module.exports = app;
