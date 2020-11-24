const fs = require('fs');
const mongoose = require('mongoose');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');

const connectDatabase = async () => {
    const conn = await  new Promise((resolve, reject) => {
        mongoose
            .connect('mongodb://127.0.0.1:27017/crmag', {
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false,
                useUnifiedTopology: true,
            })
            .then(() => {
                resolve('Database connected successfully');
            });
    });

    console.log(conn);
}

const createNewProduct = async (body, category) => {
    try{
        const newProduct = await Product.create({
            name: body.name,
            price: body.price,
            category: body.category,
            summary: body.summary,
            description: body.description,
            imageCover: body.imageCover,
            images: body.images,
            // ratingsAverage: body.ratingsAverage,
            // ratingsQuantity: body.ratingsQuantity,
        });

        console.log(newProduct);
        if (!newProduct){
            console.log('not created');
            return;
        }
        await category.updateCategoryItemsCount('increase');
        await category.save();

    }catch(err) {
        console.log(err);
    }

}


const readJSON = async () => {
    await connectDatabase();

    const file = fs.readFileSync('./desktopAPI.json', 'utf-8');
    const json = JSON.parse(file);
    // console.log(json.data.items[1]);

    try{
        const category = await Category.findOne({ categoryName: 'desktop-pc' });
        if (!category) {
            console.log('no category found');
            return;
        };

        let body;
        json.data.items.forEach(async el => {
            body = {
                name: el.productElements.title.title,
                price: el.trace.utLogMap.price,
                category: category._id,
                summary: el.productElements.title.title,
                description: el.productElements.title.title,
                images: []
            }

            if(el.productElements.image.imgUrl.startsWith('//')) {
                let imageUrl = el.productElements.image.imgUrl.split('');
                imageUrl.unshift(':');
                imageUrl.unshift('p');
                imageUrl.unshift('t');
                imageUrl.unshift('t');
                imageUrl.unshift('h');
                imageUrl = imageUrl.join('');
                body.imageCover = imageUrl;
            }else {
                body.imageCover = el.productElements.image.imgUrl;
            }
    
            // console.log(body);
            await createNewProduct(body, category);
        });
    }catch(err) {
        console.log(err);
    }

    // process.exit(1);
}
readJSON();