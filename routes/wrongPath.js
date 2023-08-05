const router = require('express').Router();
const { NOT_FOUND } = require('../utils/errorCodes');

const sendAllert = (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Путь не найден' });
};

router.use('/', sendAllert);

module.exports = router;
