const express = require("express");
const cors = require('cors');
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const session = require('express-session');
const MemoryStore = require("memorystore")(session);
const passport = require("passport");
const initializePassport = require("./config/passport");
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');
const helmet = require('helmet');
const compression = require('compression');
const fileUpload = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');
const config = require("./config/config");
const logger = require('./utils/logger');
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const db = require("./models");

const app = express();

// View engine setup
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

// Express layouts middleware
app.use(expressLayouts);
app.set('layout', 'layouts/dashboard/index'); // Set default layout
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

// Basic middleware
app.use(morgan("dev"));
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: false, limit: '100mb' }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(cookieParser(config.jwtSecret));

// File Upload Middleware
app.use(fileUpload({
    createParentPath: true,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB max file size
    },
    abortOnLimit: true
}));

app.set('trust proxy', 1);
app.use(session({
    // Security
    secret: config.jwtSecret,
    name: 'x-session-id', // Don't use default 'connect.sid'
    // Session behavior
    resave: false,
    saveUninitialized: false,
    rolling: true, // Reset expiry on activity
    store: new MemoryStore({
		checkPeriod: 86400000,
	}),
    // Cookie security
    cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        httpOnly: true, // Prevent XSS
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'strict', // CSRF protection
        signed: true // Sign cookies for tamper protection
    }
}));

app.use(flash());
// Initialize Passport
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Development: Inject dummy user if no user is logged in
if (process.env.NODE_ENV === 'development' || app.get('env') === 'development') {
    app.use(async (req, res, next) => {
        // Only inject dummy user if no user is authenticated
        // if (!req.user) {
        //     try {
        //         // Try to find or create a dummy test user
        //         let dummyUser = await db.User.findOne({
        //             where: {
        //                 email: 'test@mixpost.dev'
        //             }
        //         });

        //         if (!dummyUser) {
        //             // Create dummy user if it doesn't exist
        //             dummyUser = await db.User.create({
        //                 uuid: uuidv4(),
        //                 fullName: 'Test User',
        //                 email: 'test@mixpost.dev',
        //                 role: 'user',
        //                 isActive: true,
        //                 provider: 'local'
        //             });
        //             logger.info('Created dummy test user for development');
        //         }

        //         // Attach dummy user to request
        //         req.user = {
        //             uuid: dummyUser.uuid,
        //             fullName: dummyUser.fullName,
        //             email: dummyUser.email,
        //             role: dummyUser.role,
        //             isActive: dummyUser.isActive,
        //             provider: dummyUser.provider
        //         };

        //         // Also set it in session for passport
        //         req.session.passport = req.session.passport || {};
        //         req.session.passport.user = dummyUser.uuid;
        //     } catch (error) {
        //         logger.error('Error creating/finding dummy user:', error);
        //         // Continue without dummy user if there's an error
        //     }
        // }
        next();
    });
}

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
// Make user available to all templates
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.messages = req.flash();
    next();
});


// Routes
const indexRouter = require("./routes/index");
app.use("/", indexRouter);

// Error handlers
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.message = `The requested resource ${req.url} was not found.`;
    logger.error(err);
    err.status = 404;
    next(err);
});

if(app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        console.log(err);
        res.status(err.status || 500);
        res.send(err.message);
    });
}

app.use((err, req, res, next) => {
    console.error(err.stack);
    logger.error('Unhandled error:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        user: req.user ? req.user.email : 'Anonymous'
    });
    res.status(500).json({
        status: '500',
        message: 'Something went wrong!'
    });
});

module.exports = app;
