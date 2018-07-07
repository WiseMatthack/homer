const Command = require('../../structures/Command');
const Menu = require('../../structures/Menu');
const { RichEmbed } = require('discord.js');

class RadioCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'radio',
      category: 'misc',
      children: [
        new ListSubcommand(client),
        new TuneSubcommand(client),
        new VolumeSubcommand(client),
        new StopSubcommand(client),
        new ChannelSubcommand(client),
        new InfoSubcommand(client),
      ],
    });
  }

  async execute(context) {
    context.reply(context.__('radio.hub', { prefix: this.client.prefix }));
  }
}

class ListSubcommand extends Command {
  constructor(client) {
    super(client, {
      name: 'list',
      category: 'misc',
    });
  }

  async execute(context) {
    const radios = await this.client.database.getDocuments('radios');
    if (radios.length === 0) return context.replyWarning(context.__('radio.list.noRadio'));

    const menu = new Menu(
      context,
      radios
        .sort((a, b) => parseFloat(a.id) > parseFloat(b.id))
        .map(r => `\`${r.id}\`: ${r.emote} **[${r.name}](${r.website})** - ${r.language} (${r.country}) - ${context.__(`radio.types.${r.type}`)}`),
    );

    menu.send(context.__('radio.list.title', { name: this.client.user.username }));
  }
}

class TuneSubcommand extends Command {
  constructor(client) {
    super(client, {
      name: 'tune',
      category: 'misc',
      usage: '<frequency>',
    });
  }

  async execute(context) {
    const channel = context.message.guild.channels.get(context.settings.radio.channel);
    if (!channel) return context.replyWarning(context.__('radio.noRadioChannel', { prefix: this.client.prefix }));
    if (!channel.joinable || !channel.speakable) return context.replyError(context.__('radio.cannotJoinOrSpeak', { name: channel.name }));
    if (!channel.members.has(context.message.author.id)) return context.replyWarning(context.__('radio.notInChannel'));

    const frequency = context.args[0];
    if (!frequency) return context.replyError(context.__('radio.tune.noFrequency'));

    const radio = await this.client.database.getDocument('radios', frequency);
    if (!radio) return context.replyWarning(context.__('radio.tune.noRadioFound', { frequency }));

    let connection = this.client.voiceConnections.get(context.message.guild.id);
    if (!connection) connection = await channel.join();

    const hq = (this.client.config.owners.includes(context.message.author.id) || await this.client.database.getDocument('donators', context.message.author.id));
    const message = await context.message.channel.send(context.__('radio.tune.tuning', { name: radio.name }));
    const dispatcher = await connection.playStream(
      radio.url,
      {
        volume: context.settings.radio.volume || 0.5,
        bitrate: hq ? 96 : 48,
      },
    );

    if (this.client.currentBroadcasts.find(b => b.guild === context.message.guild.id)) {
      this.client.currentBroadcasts.splice(this.client.currentBroadcasts.findIndex(b => b.guild === context.message.guild.id), 1);
    }

    this.client.currentBroadcasts.push({
      guild: context.message.guild.id,
      radio: radio.id,
    });
    dispatcher.once('speaking', () => message.edit(context.__('radio.tune.playing', { name: radio.name })));
  }
}

class VolumeSubcommand extends Command {
  constructor(client) {
    super(client, {
      name: 'volume',
      category: 'misc',
      usage: '<volume (0-100)>',
    });
  }

  async execute(context) {
    let volume = context.args[0];
    if (isNaN(parseInt(volume)) || volume < 0 || volume > 100) return context.replyError(context.__('radio.volume.invalidVolume'));

    volume = (volume / 100).toFixed(1);
    await this.client.database.updateDocument('settings', context.message.guild.id, {
      radio: { volume },
    });

    const currentBroadcast = this.client.voiceConnections.get(context.message.guild.id);
    if (currentBroadcast && currentBroadcast.dispatcher) await currentBroadcast.dispatcher.setVolume(volume);

    context.replySuccess(context.__('radio.volume.set', { volume: (volume * 100) }));
  }
}

class StopSubcommand extends Command {
  constructor(client) {
    super(client, {
      name: 'stop',
      category: 'misc',
    });
  }

  async execute(context) {
    const channel = context.message.guild.channels.get(context.settings.radio.channel);
    if (!channel) return context.replyWarning(context.__('radio.noRadioChannel', { prefix: this.client.prefix }));
    if (!channel.joinable || !channel.speakable) return context.replyError(context.__('radio.cannotJoinOrSpeak', { name: channel.name }));
    if (!channel.members.has(context.message.author.id)) return context.replyWarning(context.__('radio.notInChannel'));

    let connection = this.client.voiceConnections.get(context.message.guild.id);
    if (!connection) return context.replyWarning(context.__('radio.stop.noActiveStream', { name: connection.channel.name }));
    await channel.leave();
    this.client.currentBroadcasts.splice(this.client.currentBroadcasts.findIndex(b => b.guild === context.message.guild.id), 1);

    context.replySuccess(context.__('radio.stop.done'));
  }
}

class ChannelSubcommand extends Command {
  constructor(client) {
    super(client, {
      name: 'channel',
      category: 'misc',
      usage: '[channel]',
      userPermissions: ['MANAGE_GUILD'],
    });
  }

  async execute(context) {
    const search = context.args.join(' ');
    let channel = context.message.guild.channels.filter(c => c.type === 'voice').find(c => c.members.has(context.message.author.id));
    if (search) {
      const foundChannels = this.client.finder.findRolesOrChannels(context.message.guild.channels.filter(c => c.type === 'voice'), search);
      if (!foundChannels || foundChannels.length === 0 || !foundChannels[0]) return context.replyError(context.__('finderUtil.findChannels.zeroResult', { search }));
      else if (foundChannels.length === 1) channel = foundChannels[0];
      else if (foundChannels.length > 1) return context.replyWarning(this.client.finder.formatChannels(foundChannels, context.settings.misc.locale));
    }
    if (!channel) return context.replyWarning(context.__('radio.channel.noChannelFound'));

    context.settings.radio.channel = channel.id;
    await context.saveSettings();

    context.replySuccess(context.__('radio.channel.set', { name: channel.name }));
  }
}

class ChannelClearSubcommand extends Command {
  constructor(client) {
    super(client, {
      name: 'clear',
      category: 'misc',
      userPermissions: ['MANAGE_GUILD'],
    });
  }

  async execute(context) {
    const channel = context.message.guild.channels.get(context.settings.radio.channel);
    if (!channel) return context.replyWarning(context.__('radio.noRadioChannel', { prefix: this.client.prefix }));

    context.settings.radio.channel = '0';
    await context.saveSettings();
    context.replySuccess(context.__('radio.channel.clear.cleared'));
  }
}

class InfoSubcommand extends Command {
  constructor(client) {
    super(client, {
      name: 'info',
      category: 'misc',
    });
  }

  async execute(context) {
    const currentBroadcast = this.client.currentBroadcasts.find(b => b.guild === context.message.guild.id);
    if (!currentBroadcast) return context.replyWarning(context.__('radio.info.noActiveStream'));
    const streamTime = this.client.voiceConnections.get(context.message.guild.id).dispatcher.totalStreamTime;
    const meta = await this.client.database.getDocument('radios', currentBroadcast.radio);

    const infoDescription = [
      `${this.dot} ${context.__('radio.info.embed.name')}: **[${meta.name}](${meta.website})**`,
      `${this.dot} ${context.__('radio.info.embed.language')}: **${meta.language}**`,
      `${this.dot} ${context.__('radio.info.embed.country')}: **${meta.country}**`,
      `${this.dot} ${context.__('radio.info.embed.type')}: **${context.__(`radio.types.${meta.type}`)}**`,
      `${this.dot} ${context.__('radio.info.embed.since')}: ${this.client.time.timeSince(Date.now() - streamTime)}`,
    ].join('\n');

    const embed = new RichEmbed()
      .setDescription(infoDescription)
      .setThumbnail(`https://${this.client.config.server.domain}/assets/radios/${meta.logo}.png?nocache=${Date.now()}`);

    context.reply(context.__('radio.info.title'), { embed });
  }
}

module.exports = RadioCommand;
