const router = require('express').Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateAvatar,
  updateProfile,
} = require('../controllers/users');

const sendError = require('../middlewares/sendError');

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:userId', getUserById, sendError);
router.patch('/me/', updateProfile, sendError);
router.patch('/me/avatar', updateAvatar, sendError);

module.exports = router;
