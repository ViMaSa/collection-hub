const express = require('express');
const methodOverride = require('method-override')
const session = require('express-session');
const User = require('./models/user');
const MongoDBStore = require('connect-mongodb-session')(session);
require('dotenv').config()
const port = process.env.PORT || 3000;

const app = express();
const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'mySessions'
});
require('./db-utils/connect')
const collectionController = require('./controllers/collectionController')
const userController = require('./controllers/userController')
const commentsController = require('./controllers/commentsController')

// app.use('/public',express.static(__dirname + '/public/'))
app.use(express.static("stylesheets"))
app.use(methodOverride('_method'))
app.use(require('./middleware/logger'))
const isLoggedIn = require('./middleware/isLoggedIn')
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
}))
app.use(async (req, res, next)=>{
    // This will send info from session to templates
    res.locals.isLoggedIn = req.session.isLoggedIn
    if(req.session.isLoggedIn){
        const currentUser = await User.findById(req.session.userId)
        res.locals.username = currentUser.username
        res.locals.userId = req.session.userId.toString()
    }
    next()
})

app.get('/', async (req, res) => {
    const users = await User.find();
    if(req.session.isLoggedIn) {
        const user = await User.findById(req.session.userId)
        res.render('home.ejs', {
            user: user,
            users: users
        })
    }
    else {
        res.render('home.ejs', {
            user: 0,
            users: users
        });
    }
});
app.use('/users', userController);

app.use('/collections', isLoggedIn, collectionController, commentsController );


module.exports = app.listen(port, ()=>{
    console.log('app running');
})