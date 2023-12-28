const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
// importing database 
const sequelize = require('./util/database')

// importing models 

const productModel = require('./models/product')
const userModel = require('./models/userModel')
const cartItemModel = require('./models/cartItemModel')
const cartModel = require('./models/cart')
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    userModel.findByPk(1)
        .then((user) => {
            req.user = user
            next()
        })
        .catch(err => console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// associatation 
productModel.belongsTo(userModel, { constraints: true, onDelete: 'CASCADE' })
userModel.hasMany(productModel)
userModel.hasOne(cartModel)
cartModel.belongsTo(userModel)
cartModel.belongsToMany(productModel, { through: cartItemModel })
productModel.belongsToMany(cartModel, { through: cartItemModel })

sequelize
    .sync()
    .then(() => {
        return userModel.findByPk(1)
    })
    .then((user) => {
        if (!user) {
            console.log("hello")
            return userModel.create({ name: "Sourav Pathak", email: "spathak7431@gmail.com", })
        }
        return user
    })
    .then((user) => {
        return user.createCart()
    })
    .then(() => {
        app.listen(3000, () => {
            console.log("App listening  ")
        });

    })

