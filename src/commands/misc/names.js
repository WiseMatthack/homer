const Command = require('../../structures/Command');

class NamesCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'names',
      aliases: ['previousnames'],
      usage: '[user]',
      dm: true,
    });
  }

  async execute(context) {
    const search = context.args.join(' ');
    let user = context.message.author;
    if (search && context.message.guild) {
      const foundMembers = this.client.finder.findMembers(context.message.guild.members, search);
      if (!foundMembers || foundMembers.length === 0) return context.replyError(context.__('finderUtil.findMembers.zeroResult', { search }));
      if (foundMembers.length === 1) user = foundMembers[0].user;
      else if (foundMembers.length > 1) return context.replyWarning(this.client.finder.formatMembers(foundMembers, context.settings.misc.locale));
    }

    const names = await this.client.database.getDocument('names', user.id);
    if (!names) return context.replyWarning(context.__('names.noPreviousNames', { name: `**${user.username}**#${user.discriminator}` }));

    context.replySuccess([
      context.__('names.title', { name: `**${user.username}**#${user.discriminator}` }),
      names.names.join(', '),
    ].join('\n'));
  }
}

module.exports = NamesCommand;
