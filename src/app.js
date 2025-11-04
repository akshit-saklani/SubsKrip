const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');

const { protect } = require('./middlewares/authMiddleware');

const authRoutes = require('./routes/authRoutes');
const pageRoutes = require('./routes/pageRoutes');
const teamRoutes = require('./routes/teamRoutes');
const customerRoutes = require('./routes/customerRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(expressLayouts);
app.set('layout', 'layouts/main');

app.use(express.static('public'));

app.use(cookieParser());

app.use(bodyParser.json()); // Parses JSON bodies (from fetch/AJAX calls)
app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded bodies (from traditional HTML forms)

// Session Middleware
app.use(session({
    secret: 'your_secret_key_here', // CHANGE THIS!
    resave: false,
    saveUninitialized: true,
}));

// Flash Middleware
app.use(flash());

// Make flash messages available to all templates/views
app.use((req, res, next) => {
    // These keys ('success', 'error', 'info') will hold your messages
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.info = req.flash('info');
    next();
});

//authentication end points must be public
app.use('/api/auth', authRoutes);
app.get('/login', (req, res) => res.render('login', { layout: false }));
app.get('/register', (req, res) => res.render('register', { layout: false }));

app.use(protect); 

app.get('/home', (req, res) => res.render('home', { title: 'Dashboard' }));

app.use('/', pageRoutes); 
app.use('/api/team', teamRoutes);
app.use('/api/customers',customerRoutes);

app.get('/', (req, res) => {
    res.send('API is running');
});

module.exports = app;