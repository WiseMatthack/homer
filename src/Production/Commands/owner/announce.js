const Command = require('../../../Core/Structures/Command');

class Announce extends Command {
  constructor(client) {
    super(client, {
      name: 'announce',
      category: 'owner',
      private: true,
    });
  }

  async run(ctx) {
    const updateMessage = ctx.args.join(' ');
    if (!updateMessage) return ctx.channel.send(`${this.client.constants.statusEmotes.error} You must provide an update message to send!`);
    if (updateMessage.length > 1950) return ctx.channel.send(`${this.client.constants.statusEmotes.error} Cannot send a message longer than 1950 characters.`);
  
    const updateChannel = this.client.channels.get(this.client.config.support.updateChannel);
    if (!updateChannel) return ctx.channel.send(`${this.client.constants.statusEmotes.error} No update channel found... Check configuration!`);

    const updateRole = updateChannel.guild.roles.get(this.client.config.support.updateRole);
    if (!updateRole) return ctx.channel.send(`${this.client.constants.statusEmotes.error} No update role found... Check configuration!`);

    // We set the role as mentionable
    await updateRole.setMentionable(true, 'Announcement');

    // We send the message
    await updateChannel.send(`${updateRole.toString()}\n${updateMessage}`);

    // We set the role as non-mentionable
    await updateRole.setMentionable(false, 'Announcement');

    ctx.channel.send(`${this.client.constants.statusEmotes.success} Announcement sent in ${updateChannel.toString()}!`);
  }
}

module.exports = Announce;
