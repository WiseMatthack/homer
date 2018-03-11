const Event = require('../../Core/Structures/Event');

class Reconnecting extends Event {
  constructor(client) {
    super(client, 'reconnecting');
  }

  async handle() {
    console.log('[WS] Reconnecting to Discord...');
  }
}

module.exports = Reconnecting;
