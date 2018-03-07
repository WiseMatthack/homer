const Event = require('../../Core/Structures/Event');

class Ready extends Event {
  constructor(client) {
    super(client, 'ready');
  }

  async handle() {
    console.log(`[Discord] Connected as ${this.client.user.tag}. On ${this.client.guilds.size} servers with ${this.client.users.size} users.`);
    this.client.user.setGame(`Type ${this.client.config.discord.defaultPrefixes[0]}help! On ${this.client.guilds.size} servers with ${this.client.users.size} users. Note: BETA version, may be buggy.`);

    this.client.initiateCleverbot();
  }
}

module.exports = Ready;
