module.exports.fakeUserId = (req, res, next) => {
  req.user = {
    _id: '64ca18e62764e2b369eda3ff',
  };

  next();
};
