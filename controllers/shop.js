const Cart = require('../models/cart');
const Product = require('../models/product');
const Order = require('../models/order');

const items_per_page=+2;
const items_per_pageC=+1;

exports.getProducts = (req, res, next) => {
  Product.findAll().then(products=>{
    res.json(products);
    // res.render('shop/product-list', {
    //   prods: products,
    //   pageTitle: 'All Products',
    //   path: '/products'
    // });
  }).catch(err=>{
    console.log(err);
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findAll({where:{id:prodId}})
  .then(prods=>{
    res.render('shop/product-detail',
    {
      product:prods[0],
      pageTitle:prods[0].title,
      path:'/products'
    })
  })
  .catch(err=>{
    console.log(err);
  });
};

exports.getIndex = (req, res, next) => {
  
  const page=+req.query.page;
  console.log("page"+page);
  const off = (page-1) * items_per_page;
  let totalItem;
  Product.findAll()
  .then(product=>{
    totalItem = product.length;
  })
  
  Product.findAll({
    offset: off, limit: items_per_page,subQuery:false})
    .then(products=>{
      
      res.json({
        products,totalItem,page,
        hasNext: items_per_page*page<totalItem,
        hasPrev:page>1,
        nextPage:page+1,
        prevPage:page-1,
        lastPage:Math.ceil(totalItem/items_per_page)
      });
    // res.render('shop/index', {
    //   prods: products,
    //   pageTitle: 'Shop',
    //   path: '/'
    // });
  }).catch(err=>{
    console.log(err);
  });
};

exports.getCart = (req, res, next) => {
  const page=+req.query.page;
  const off = (page-1) * items_per_pageC;
  let totCartItems=0;
  req.user
  .getCart()
  .then(cart => {
    return cart
      .getProducts().then(products=>{
          totCartItems=products.length;
      })})

  req.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts({
          offset: off, limit: items_per_pageC,subQuery:false})
        .then(products => {
          res.json({products,totCartItems,lastPC:Math.ceil(totCartItems/items_per_pageC)});
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      res.status(200).json({success:true,message:"Product Added to Cart"})
    })
    .catch(err => {
      res.status(500).json({success:false,message:"Error Occured"})
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = +req.body.productId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => {
      res.status(200).json({success:true,message:"Product Deleted From Cart"})
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include:['products']})
  .then(result=>{
    console.log(result)
    res.json(result);
  })
  .catch(err=>{
    console.log(err);
  })
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

exports.postOrder = (req,res)=>{
  req.user.getCart().then(cart=>{
    return cart.getProducts();
  })
  .then(products=>{
    return req.user.createOrder()
    .then(order=>{
      return order.addProducts(products.map(prod=>{
        prod.orderItem = {quantity:prod.cartItem.quantity};
        return prod;
      }))
    })
  })
  .then(result=>{
    // res.json(result);
    res.status(200).json(result);
  })
  .catch(err=>{
    console.log(err);
  })
};



