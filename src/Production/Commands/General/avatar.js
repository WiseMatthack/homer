const Command = require('../../../Core/Structures/Command');
const { RichEmbed } = require('discord.js');

class Avatar extends Command {
  constructor(client) {
    super(client, {
      name: 'avatar',
      category: 2,
    });
  }

  async run(ctx) {
    await ctx.guild.fetchMembers();

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

    const embed = new RichEmbed()
      .setImage(member.user.displayAvatarURL)
      .setColor(ctx.guild.me.displayHexColor);

    ctx.channel.send(ctx.__('avatar.title', {
      name: member.user.tag,
    }), { embed });
  }
}

module.exports = Avatar;
