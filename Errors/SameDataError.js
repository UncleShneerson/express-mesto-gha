const ValidationError = require('./ValidationError');

class SameDataError extends ValidationError {
  constructor(data) {
    super(data);
    this.message = 'Переданы предыдущие значения';
    this.name = 'SameDataError';
  }
}

module.exports = SameDataError;
