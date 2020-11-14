// Core modules

// 3rd-party modules
const express = require('express');
const morgan = require('morgan');
// const ejs = require('ejs');

// Own modules
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);

app.use('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `This route doesn't exists`,
  });
});
app.use(globalErrorHandler);

module.exports = app;
