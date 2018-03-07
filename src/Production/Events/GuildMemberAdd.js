const Event = require('../../Core/Structures/Event');
const DataGuild = require('../../Core/Structures/Data/DataGuild');

class GuildMemberAdd extends Event {
  constructor(client) {
    super(client, 'guildMemberAdd');
  }

  async handle(member) {
    const settings = new DataGuild(this.client, member.guild.id);
    await settings.getData();

    if (settings.data.welcome.channel) {
      const channel = this.client.channels.get(settings.data.welcome.channel);
      if (!channel) return;

      channel.send(this.client.lisa.replaceStatic(settings.data.welcome.message, member, 1));
    }
  }
}

module.exports = GuildMemberAdd;
