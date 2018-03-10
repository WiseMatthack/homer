const Event = require('../../Core/Structures/Event');

class Ready extends Event {
  constructor(client) {
    super(client, 'ready');
  }

  async handle() {
    console.log(`[Discord] Connected as ${this.client.user.tag}. On ${this.client.guilds.size} servers with ${this.client.users.size} users.`);
    this.client.updateGame();

    this.client.initiateCleverbot();

    this.client.database.getDocuments('poll')
      .then((polls) => {
        polls.forEach(poll => setTimeout(this.client.stuffHandler.handlePoll, (poll.endTime - Date.now()), this.client, poll.id));
      })
      .catch(() => console.log('[Poll] Unable to get the polls from the database!'));

    this.client.database.getDocuments('profile')
      .then((profiles) => {
        profiles.forEach(profile => profile.reminds.forEach(remind => setTimeout(this.client.stuffHandler.handleRemind, (remind.end - Date.now()), this.client, profile.id, remind.index)));
      })
      .catch(() => console.log('[Profile] Unable to get profiles from the database!'));
  }
}

module.exports = Ready;
