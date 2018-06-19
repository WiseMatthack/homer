const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');

class EmoteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'emote',
      dm: true,
    });
  }

  async execute(context) {
    const search = context.args.join(' ');
    let emoji = null;
    if (search) {
      const foundEmojis = await this.client.finder.findEmojis(search);
      if (!foundEmojis || foundEmojis.length === 0) return context.replyError(context.__('finderUtil.findEmojis.zeroResult', { search }));
      else if (foundEmojis.length === 1) emoji = foundEmojis[0];
      else if (foundEmojis.length > 1) return context.replyWarning(this.client.finder.formatEmojis(foundEmojis, context.settings.misc.locale));
    } else {
      return context.replyError(context.__('emote.noQuery'));
    }

    const emoteInformation = [
      `${this.dot} ${context.__('emote.embed.id')}: **${emoji.id}**`,
      `${this.dot} ${context.__('emote.embed.guild')}: ${emoji.guild ? `**${emoji.guild}**` : `*${context.__('global.unknown')}*`}`,
      `${this.dot} ${context.__('emote.embed.animated')}: **${emoji.animated ? context.__('global.yes') : context.__('global.no')}**`,
      `${this.dot} ${context.__('emote.embed.managed')}: **${emoji.managed ? context.__('global.yes') : context.__('global.no')}**`,
      `${this.dot} ${context.__('emote.embed.url')}: **[${context.__('global.image')}](${emoji.url})**`,
    ].join('\n');

    const embed = new RichEmbed()
      .setDescription(emoteInformation)
      .setThumbnail(emoji.url);
    
    context.replySuccess(
      context.__('emote.title', { name: emoji.name }),
      { embed },
    );
  }
}

module.exports = EmoteCommand;
