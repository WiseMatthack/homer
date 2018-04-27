const Command = require('../../../Core/Structures/Command');

class Names extends Command {
  constructor(client) {
    super(client, {
      name: 'names',
      aliases: ['oldnames'],
      category: 'misc',
    });
  }

  async run(ctx) {
    let { member } = ctx;
    const search = ctx.args.join(' ');
    if (ctx.mentions.members.size > 0) member = ctx.mentions.members.first();
    else if (search) {
      const members = this.client.finder.findMembers(search, ctx.guild.id);
      if (members.size === 0) return ctx.channel.send(ctx.__('finder.members.noResult', { errorIcon: this.client.constants.statusEmotes.error, search }));
      else if (members.size > 1) return ctx.channel.send(this.client.finder.formatMembers(
        members,
        ctx.settings.data.misc.locale,
      ));
      member = members.first();
    }

    const oldNames = await this.client.database.getDocument('names', member.id);
    if (!oldNames) return ctx.channel.send(ctx.__('names.error.noRecordedName', {
      warnIcon: this.client.constants.statusEmotes.warning,
      tag: member.user.tag,
    }));

    ctx.channel.send(ctx.__('names.namesFor', {
      tag: member.user.tag,
      names: oldNames.names.sort((a, b) => b > a).join(', '),
    }));
  }
}

module.exports = Names;
