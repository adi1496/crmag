const fsPromises = require('fs/promises');

const Category = require('./../models/categoryModel');
const Product = require('./../models/productModel');

/*****************************
 * UPDATE CATEGORY ITEMS-COUNTER
 *  *************************/
exports.updateCategoryItemsCount = async () => {
  const categories = await Category.find();
  let isNotError = true;
  const newCount = await Promise.all(
    categories.map(async (category) => {
      const products = await Product.find({ category: category._id });
      if (category.items !== products.length) {
        isNotError = false;
        const message = `Database error: ${new Date()}\nCategory "${
          category.categoryName
        }" not equal with the number of products belong to this category. Somebody deleted products manually in the database!!!!! \n category-items: ${
          category.items
        } vs products-count: ${products.length}`;
        console.log(message);

        let data = await fsPromises.readFile(`${__dirname}/../data/logs.txt`, 'utf-8');
        data = `${data}\n${message}`;
        await fsPromises.writeFile(`${__dirname}/../data/logs.txt`, data, 'utf-8');

        category.items = products.length;
        category.save();
      }
      return products.length;
    })
  );
  if (isNotError) console.log('Database 🆗');
};
