const Event = require('../../Core/Structures/Event');

class Ready extends Event {
  constructor(client) {
    super(client, 'ready');
  }

  async handle() {
    console.log(`[Discord] Connected as ${this.client.user.tag}. On ${this.client.guilds.size} servers with ${this.client.users.size} users.`);

    this.client.updateGame();
    setInterval(() => {
      this.client.updateGame();
      this.client.misc.updateCount();
    }, 10000);

    this.client.database.getDocuments('poll')
      .then((polls) => {
        polls.forEach(poll => this.client.setTimeout(
          this.client.stuffHandler.handlePoll,
          (poll.endTime - Date.now()),
          this.client,
          poll.id,
        ));
      })
      .catch(() => console.log('[Poll] Unable to get the polls from the database!'));

    this.client.database.getDocuments('profile')
      .then((profiles) => {
        profiles.forEach(profile => profile.reminds.forEach(remind => this.client.setTimeout(
          this.client.stuffHandler.handleRemind,
          (remind.end - Date.now()),
          this.client,
          profile.id,
          remind.index,
        )));
      })
      .catch(() => console.log('[Profile] Unable to get profiles from the database!'));

    this.client.database.getDocuments('guild')
      .then((guilds) => {
        guilds.forEach(guild => guild.moderation.cases
          .filter(c => c.action === 6 && c.extra.finished === false)
          .forEach(c => this.client.setTimeout(
            this.client.stuffHandler.handleUnban,
            (c.extra.end - Date.now()),
            this.client,
            guild.id,
            c.target,
          )));
      })
      .catch(() => console.log('[Guild] Unable to get guilds from the database!'));
  }
}

module.exports = Ready;
