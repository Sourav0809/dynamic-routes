
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user.createProduct({
    title: title,
    price: price,
    imageUrl: imageUrl,
    discription: description,
    userId: req.user.id

  })
    .then(() => {
      res.redirect('/admin/products')
      console.log("Product Created")
    })
    .catch(err => console.log(err))
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  req.user.getProducts({ where: { id: prodId } })
    .then((product) => {
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product[0]
      });
    })
    .catch(err => console.log(err))

};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findAll({ where: { id: prodId } })
    .then((products) => {
      const product = products[0];
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDesc;
      return product.save(); // return the save() Promise
    })
    .then(() => {
      console.log("Product updated !!")
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err))

};

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
    .then((
      products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    });
};


exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findAll({ where: { id: prodId } })
    .then((findedProducts) => {
      return findedProducts[0].destroy()
    })
    .then(() => {
      console.log("Product deleted !! ")
      res.redirect('/admin/products');

    })
    .catch(err => console.log(err))
};
