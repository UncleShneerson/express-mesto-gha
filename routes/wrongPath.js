const router = require('express').Router();

const sendAllert = (req, res) => {
  res.status(404).send({ message: 'Путь не найден' });
};

router.get('/', sendAllert);

module.exports = router;
