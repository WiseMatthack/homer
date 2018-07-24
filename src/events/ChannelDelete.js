const Event = require('../structures/Event');

class ChannelDeleteEvent extends Event {
  constructor(client) {
    super(client, 'channelDelete');
  }

  async handle(channel) {
    if (channel.guild) {
      this.client.database.getDocument('settings', channel.guild.id).then((settings) => {
        if (!settings) return;

        if (settings.ignored.find(i => i.id === channel.id)) {
          settings.ignored.splice(settings.ignored.findIndex(i => i.id === channel.id), 1);
        }

        this.client.database.insertDocument(
          'settings',
          settings,
          { conflict: 'update' },
        );
      });
    }

    // Deleting phone subscription
    this.client.other.deleteSub(channel.id);
  }
}

module.exports = ChannelDeleteEvent;
