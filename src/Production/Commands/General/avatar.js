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
    let member = ctx.member;
    const search = ctx.args.join(' ');
    if (search) {
      if (ctx.mentions.members.size > 0) member = ctx.mentions.members.first();
      else {
        member = this.client.finder.findMembers(search, ctx.guild.id);
        if (member.size === 0) return ctx.channel.send(ctx.__('finder.members.noResult', {
          errorIcon: this.client.constants.statusEmotes.error,
          search,
        }));
        else if (member.size === 1) member = member.first();
        else return ctx.channel.send(this.client.finder.formatMembers(member, ctx.settings.data.misc.locale));
      }
    }

    const embed = new RichEmbed()
      .setImage(member.user.avatarURL)
      .setColor(ctx.guild.me.displayHexColor);

    ctx.channel.send(ctx.__('avatar.title', {
      name: member.user.tag,
    }), { embed });
  }
}

module.exports = Avatar;
