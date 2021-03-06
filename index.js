const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

const Product = require('./models/product');

mongoose
  .connect('mongodb://localhost:27017/farmStand', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('mongo connection open!');
  })
  .catch((err) => {
    console.log('Mongo connection error');
    console.log(err);
  });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/products', async (req, res, next) => {
  const products = await Product.find({});
  res.render('products/index', { products });
});

app.get('/products/new', (req, res, next) => {
  res.render('products/new');
});

app.post('/products', async (req, res, next) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.redirect(`/products/${newProduct._id}`);
});

app.get('/products/:id', async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render('products/show', { product });
});

app.listen(3000, () => {
  console.log('App is listening on PORT 3000');
});
