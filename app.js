// Спасибо за ревью. Надеюсь в этот раз получилось все сделать лучше )
// Многое просто переписал по новой.

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const sendError = require('./middlewares/sendError');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '64ca18e62764e2b369eda3ff',
  };
  next();
});

app.use('/users', require('./routes/users'), sendError);
app.use('/cards', require('./routes/cards'), sendError);
app.use('*', require('./routes/wrongPath'));

app.listen(PORT);
