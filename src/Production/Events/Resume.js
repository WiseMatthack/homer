const Event = require('../../Core/Structures/Event');

class Resume extends Event {
  constructor(client) {
    super(client, 'resume');
  }

  async handle(count) {
    console.log(`[WS] Resumed connection! ${count} events replayed.`);
  }
}

module.exports = Resume;
