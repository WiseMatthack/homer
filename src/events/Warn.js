const Event = require('../structures/Event');

class WarnError extends Event {
  constructor(client) {
    super(client, 'warn');
  }

  handle(warning) {
    console.warn(warning);
  }
}

module.exports = WarnError;
