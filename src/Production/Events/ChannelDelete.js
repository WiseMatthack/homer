const Event = require('../../Core/Structures/Event');
const DataGuild = require('../../Core/Structures/Data/DataGuild');

class ChannelDelete extends Event {
  constructor(client) {
    super(client, 'channelDelete');
  }

  async handle(channel) {
    if (!channel.guild) return;

    const settings = new DataGuild(this.client, channel.guild.id);
    await settings.getData();

    if (settings.data.welcome.channel === channel.id) {
      settings.data.welcome = {
        channel: null,
        message: null,
      };
    }

    if (settings.data.leave.channel === channel.id) {
      settings.data.leave = {
        channel: null,
        message: null,
      };
    }

    if (settings.data.phone.channel === channel.id) {
      settings.data.phone.channel = null;
    }

    if (settings.data.ignoredChannels.includes(channel.id)) {
      settings.data.ignoredChannels.splice(settings.data.ignoredChannels.indexOf(channel.id), 1);
    }

    settings.saveData();
  }
}

module.exports = ChannelDelete;
