const Product = require('../models/product');
const Cart = require('../models/cartItemModel');

exports.getProducts = (req, res, next) => {

  Product.findAll()
    .then((prod) => {
      res.render('shop/product-list', {
        prods: prod,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => console.log(err))

};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findAll({ where: { id: prodId } })
    .then((product) => {

      res.render('shop/product-detail', {
        product: product[0],
        pageTitle: product[0].title,
        path: '/products'
      });

    })
    .catch(err => {
      console.log(err);
    })

};

exports.getIndex = (req, res, next) => {

  Product.findAll()
    .then((prod) => {
      res.render('shop/index', {
        prods: prod,
        pageTitle: 'Shop',
        path: '/'
      });

    })
    .catch(err => console.log(err));


};

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then((cart) => {
      console.log(cart)
      return cart.getProducts()
        .then((products) => {
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
          });
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))

  // Cart.getCart(cart => {
  //   Product.fetchAll(products => {
  //     const cartProducts = [];
  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         prod => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  //     
  //   });
  // });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;

  req.user.getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      let newQuantity = 1;
      if (product) {
        newQuantity = product.cartItem.quantity + 1;
        return product.cartItem.update({ quantity: newQuantity });
      } else {
        return Product.findByPk(prodId)
          .then((product) => {
            return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
          });
      }
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } })
    })
    .then(products => {
      const product = products[0]
      return product.cartItem.destroy()
    })

    .then(() => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

