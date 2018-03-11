const Event = require('../../Core/Structures/Event');

class WSError extends Event {
  constructor(client) {
    super(client, 'error');
  }

  async handle(error) {
    console.error(`[WS] WebSocket encoutered an error!\n${error.message}`);
  }
}

module.exports = WSError;
