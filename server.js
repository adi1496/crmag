const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = require('./app');

const backgroundJobs = require('./utils/background-jobs');

dotenv.config({
  path: './.config.env',
});

// const database = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD).replace(
//   '<dbname>',
//   process.env.DATABASE_NAME
// );
const testdb = process.env.DATABASE_LOCAL;
mongoose
  .connect(testdb, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successfully');
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`The app is listening on port ${port}...`);
  console.log(process.env.NODE_ENV);
});

setInterval(backgroundJobs.updateCategoryItemsCount, parseInt(process.env.CATEGORY_UPDATES_INTERVAL) * 60 * 60 * 1000);
