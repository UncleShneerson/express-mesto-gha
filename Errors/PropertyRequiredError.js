const ValidationError = require('./ValidationError');

class PropertyRequiredError extends ValidationError {
  constructor(data) {
    super(data);
    this.message = `Не передано значение ${data}`;
    this.name = 'PropertyRequiredError';
  }
}

module.exports = PropertyRequiredError;
