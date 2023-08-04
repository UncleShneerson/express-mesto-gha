const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const cardCreateValidation = require('../middlewares/validation/cardCreateValidation');

router.get('/', getCards);
router.post('/', cardCreateValidation, createCard);

router.delete('/:cardId', deleteCardById);

router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
