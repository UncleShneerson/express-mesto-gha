const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const sendError = require('./middlewares/sendError');
const routes = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cookieParser());
app.use(routes);
app.use(sendError);

app.listen(PORT);
