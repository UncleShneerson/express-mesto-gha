const router = require('express').Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateAvatar,
  updateProfile,
} = require('../controllers/users');

const userCreateValidation = require('../middlewares/validation/userCreateValidation');
const userUpdateValidation = require('../middlewares/validation/userUpdateValidation');
const avatarUpdateValidation = require('../middlewares/validation/avatarUpdateValidation');

router.get('/', getUsers);
router.post('/', userCreateValidation, createUser);

router.get('/:userId', getUserById);

router.patch('/me/', userUpdateValidation, updateProfile);
router.patch('/me/avatar', avatarUpdateValidation, updateAvatar);

module.exports = router;
