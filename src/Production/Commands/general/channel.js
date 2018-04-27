const Command = require('../../../Core/Structures/Command');
const { RichEmbed } = require('discord.js');
const mtz = require('moment-timezone');

class Channel extends Command {
  constructor(client) {
    super(client, {
      name: 'channel',
      category: 'general',
    });
  }

  async run(ctx) {
    let channel = ctx.channel;
    const search = ctx.args.join(' ');
    if (ctx.mentions.channels.size > 0) channel = ctx.mentions.channels.first();
    else if (search) {
      const channels = this.client.finder.findTextChannels(search, ctx.guild.id);
      if (channels.size === 0) return ctx.channel.send(ctx.__('finder.channels.noResult', { errorIcon: this.client.constants.statusEmotes.error, search }));
      channel = channels.first();
    }

    const embed = new RichEmbed()
      .addField(ctx.__('channel.embed.id'), channel.id, true)
      .addField(ctx.__('channel.embed.position.title'), ctx.__('channel.embed.position.value', { position: (channel.position + 1) }), true)
      .addField(ctx.__('channel.embed.parent'), channel.parent ? channel.parent.name : ctx.__('global.none'), true)
      .addField(ctx.__('channel.embed.creation'), mtz(channel.createdTimestamp).tz(ctx.settings.data.misc.timezone).locale(ctx.settings.data.misc.locale).format(`${ctx.settings.data.misc.dateFormat} ${ctx.settings.data.misc.timeFormat}`), true)
      .setColor(ctx.guild.me.displayHexColor);

    ctx.channel.send(ctx.__('channel.title', { name: channel.name }), { embed });
  }
}

module.exports = Channel;
