const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const csp = require('express-csp');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

require('dotenv').config({ path: './config.env' });

// untuk error handling
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// routers
const userRouters = require('./routes/userRouters');
const productRouters = require('./routes/productRouters');
const productTypeRouters = require('./routes/productTypeRouters');
const categoryRouters = require('./routes/categoryRouters');
const subCategoryRouters = require('./routes/subCategoryRouters');
const vendorRouters = require('./routes/vendorRouters');

// memulai aplikasi express
const app = express();
app.use(express());

// trusting proxy
app.enable('trust proxy');

// global middleware

// menyajikan view
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// menggunakan cors
app.use(cors());

app.options('*', cors());

// menyajikan public
const dirname = path.resolve();
app.use('/v1/im/uploads', express.static(path.join(dirname, 'uploads')));

// menggunakan helmet
app.use(helmet());

csp.extend(app, {
  policy: {
    directives: {
      'default-src': ['self'],
      'style-src': ['self', 'unsafe-inline', 'https:'],
      'font-src': ['self', 'https://fonts.gstatic.com'],
      'script-src': [
        'self',
        'unsafe-inline',
        'data',
        'blob',
        'https://*.cloudflare.com/',
        // 'https://bundle.js:8828',
        `https://localhost:${process.env.PORT}/`,
      ],
      'worker-src': [
        'self',
        'unsafe-inline',
        'data:',
        'blob:',
        'https://*.cloudflare.com/',
        // 'https://bundle.js:*',
        `https://localhost:${process.env.PORT}/`,
      ],
      'frame-src': [
        'self',
        'unsafe-inline',
        'data:',
        'blob:',
        'https://*.cloudflare.com/',
        // 'https://bundle.js:*',
        `https://localhost:${process.env.PORT}/`,
      ],
      'img-src': [
        'self',
        'unsafe-inline',
        'data:',
        'blob:',
        'https://*.cloudflare.com/',
        // 'https://bundle.js:*',
        `https://localhost:${process.env.PORT}/`,
      ],
      'connect-src': [
        'self',
        'unsafe-inline',
        'data:',
        'blob:',
        // 'wss://<HEROKU-SUBDOMAIN>.herokuapp.com:<PORT>/',
        'https://*.cloudflare.com/',
        // 'https://bundle.js:*',
        `https://localhost:${process.env.PORT}/`,
      ],
    },
  },
});

// menggunakan morgan logger middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// menggunakan api limiter
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    'Terlalu banyak request dari IP ini, mohon dicoba lagi di dalam 1 jam',
});

app.use('/v1/im', limiter);

// menggunakan express body parser
app.use(express.json({ limit: '10kb' }));

// untuk melakukan parse data yang akan datang dari sebuah URL encoded form
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// menggunakan cookie-parser
app.use(cookieParser());

// menggunakan mongo sanitization
app.use(mongoSanitize());

// menggunakan xss
app.use(xss());

// menggunakan hpp app.use(hpp());
app.use(
  hpp({
    whitelist: ['quantity', 'eachPrice', 'condition_good', 'condition_bad'],
  })
);

// menggunakan compression
app.use(compression());

// middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// api routes
app.use('/v1/im/users', userRouters);
app.use('/v1/im/products', productRouters);
app.use('/v1/im/productTypes', productTypeRouters);
app.use('/v1/im/categories', categoryRouters);
app.use('/v1/im/subCategories', subCategoryRouters);
app.use('/v1/im/vendors', vendorRouters);

// jika endpoint tidak ditemukan
app.all('*', (req, res, next) => {
  return next(
    new AppError(`Tidak bisa mencari ${req.originalUrl} di server ini!`, 404)
  );
});

// menggunakan error handler
app.use(globalErrorHandler);

module.exports = app;
