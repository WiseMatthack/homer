const Event = require('../../Core/Structures/Event');
const DataGuild = require('../../Core/Structures/Data/DataGuild');

class GuildMemberRemove extends Event {
  constructor(client) {
    super(client, 'guildMemberRemove');
  }

  async handle(member) {
    const settings = new DataGuild(this.client, member.guild.id);
    await settings.getData();

    if (settings.data.leave.channel) {
      const channel = this.client.channels.get(settings.data.leave.channel);
      if (!channel) return;

      channel.send(this.client.lisa.replaceStatic(settings.data.leave.message, member, 1));
    }
  }
}

module.exports = GuildMemberRemove;
