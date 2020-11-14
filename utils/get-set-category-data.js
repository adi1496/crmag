// const fs = require('fs');
const fsPromises = require('fs/promises');

exports.getCategoryData = async () => {
  let data = await fsPromises.readFile(`${__dirname}/../data/category.data.json`, 'utf-8');
  data = JSON.parse(data);

  return data;
};

exports.setCategoryData = async (newCategory) => {
  let data = await fsPromises.readFile(`${__dirname}/../data/category.data.json`, 'utf-8');
  data = JSON.parse(data);
  if (data.includes(newCategory)) return false;
  data.push(newCategory);
  data = JSON.stringify(data);
  await fsPromises.writeFile(`${__dirname}/../data/category.data.json`, data, 'utf-8');
  return true;
};

exports.deleteCategoryData = async (category) => {
  let data = await fsPromises.readFile(`${__dirname}/../data/category.data.json`, 'utf-8');
  data = JSON.parse(data);
  if (!data.includes(category)) return false;
  let newData = [];
  data = data.forEach((el) => {
    if (el !== category) newData.push(el);
  });
  newData = JSON.stringify(newData);
  await fsPromises.writeFile(`${__dirname}/../data/category.data.json`, newData, 'utf-8');
  return true;
};
