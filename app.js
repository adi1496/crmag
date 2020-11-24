// Core modules

// 3rd-party modules
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// Own modules
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoriesRoutes');
const userRoutes = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.use(cors());

app.use(morgan('dev'));
app.use(express.json());

app.use(express.static('public'));

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/users', userRoutes);

app.use('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `This route doesn't exists`,
  });
});
app.use(globalErrorHandler);

module.exports = app;
