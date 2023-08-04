const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((cardData) => {
      if (cardData) {
        res.status(200).send(cardData);
        return;
      }
      res.status(404).send({ message: 'Карточка не найдена' });
    })
    .catch(() => {
      res.status(400).send({ message: 'Неверный идентификатор' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((cardData) => res.send({ data: cardData }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((cardData) => {
      if (cardData) {
        res.status(200).send(cardData);
        return;
      }
      res.status(404).send({ message: 'Карточка не найдена' });
    })
    .catch(() => {
      res.status(400).send({ message: 'Неверный идентификатор' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((cardData) => {
      if (cardData) {
        res.status(200).send(cardData);
        return;
      }
      res.status(404).send({ message: 'Карточка не найдена' });
    })
    .catch(() => {
      res.status(400).send({ message: 'Неверный идентификатор' });
    });
};
