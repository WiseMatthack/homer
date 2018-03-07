const Event = require('../../Core/Structures/Event');

class Ready extends Event {
  constructor(client) {
    super(client, 'ready');
  }

  async handle() {
    console.log(`[Discord] Connected as ${this.client.user.tag}. On ${this.client.guilds.size} servers with ${this.client.users.size} users.`);
    this.client.updateGame();

    this.client.initiateCleverbot();
  }
}

module.exports = Ready;
