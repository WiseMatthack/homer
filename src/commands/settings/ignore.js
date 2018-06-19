const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');

class IgnoreCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ignore',
      aliases: ['ignored'],
      category: 'settings',
      children: [
        new UserSubcommand(client),
        new ChannelSubcommand(client),
        new CommandSubcommand(client),
      ],
    });
  }

  async execute(context) {
    if (context.settings.ignored.length === 0) return context.replyWarning(context.__('ignore.nothingIgnored'));

    const description = context.settings.ignored.map((thing) => {
      let target = null;
      if (thing.type === 'user') {
        const user = this.client.users.get(thing.id);
        if (!user) target = `*${context.__('global.unknown')}* (ID:${thing.id})`;
        else target = `**${user.username}**#${user.discriminator} (ID:${thing.id})`;
      } else if (thing.type === 'channel') {
        const channel = this.client.channels.get(thing.id);
        if (!channel) target = `*${context.__('global.unknown')}* (ID:${thing.id})`;
        else target = `**#${channel.name}** (ID:${thing.id})`;
      } else if (thing.type === 'command') {
        target = `**${thing.id}**`;
      }

      return `${this.dot} ${context.__('ignore.type')}: **${context.__(`ignore.type.${thing.type}`)}** - ${context.__('ignore.target')}: ${target}`;
    }).join('\n');

    const embed = new RichEmbed()
      .setDescription(description);

    context.reply(
      context.__('ignore.title', { name: `**${context.message.guild.name}**` }),
      { embed },
    );
  }
}

class ChannelSubcommand extends Command {
  constructor(client) {
    super(client, {
      name: 'channel',
      usage: '<channel>',
      category: 'settings',
    });
  }

  async execute(context) {
    const search = context.args.join(' ');
    let channel = null;
    if (search) {
      const foundChannels = this.client.finder.findRolesOrChannels(context.message.guild.channels, search);
      if (!foundChannels || foundChannels.length === 0 || !foundChannels[0]) return context.replyError(context.__('finderUtil.findChannels.zeroResult', { search }));
      else if (foundChannels.length === 1) channel = foundChannels[0];
      else if (foundChannels.length > 1) return context.replyWarning(this.client.finder.formatChannels(foundChannels, context.settings.misc.locale));
    } else {
      return context.replyError(context.__('ignore.channel.noSearch'));
    }

    if (context.settings.ignored.find(i => i.id === channel.id)) {
      context.settings.ignored.splice(context.settings.ignored.findIndex(i => i.id === channel.id), 1);
      await context.saveSettings();
      context.replySuccess(context.__('ignore.channel.removed', { name: `**#${channel.name}** (ID:${channel.id})` }));
    } else {
      context.settings.ignored.push({
        type: 'channel',
        id: channel.id,
      });

      await context.saveSettings();
      context.replySuccess(context.__('ignore.channel.added', { name: `**#${channel.name}** (ID:${channel.id})` }));
    }
  }
}

class UserSubcommand extends Command {
  constructor(client) {
    super(client, {
      name: 'user',
      usage: '<user>',
      category: 'settings',
    });
  }

  async execute(context) {
    const search = context.args.join(' ');
    let user = context.message.author;
    if (search) {
      const foundMembers = this.client.finder.findMembers(context.message.guild.members, search);
      if (!foundMembers || foundMembers.length === 0) return context.replyError(context.__('finderUtil.findMembers.zeroResult', { search }));
      else if (foundMembers.length === 1) user = foundMembers[0].user;
      else if (foundMembers.length > 1) return context.replyWarning(this.client.finder.formatMembers(foundMembers, context.settings.misc.locale));
    } else {
      return context.replyError(context.__('ignore.user.noSearch'));
    }

    if (context.settings.ignored.find(i => i.id === user.id)) {
      context.settings.ignored.splice(context.settings.ignored.findIndex(i => i.id === user.id), 1);
      await context.saveSettings();
      context.replySuccess(context.__('ignore.user.removed', { name: `**${user.username}**#${user.discriminator} (ID:${user.id})` }));
    } else {
      context.settings.ignored.push({
        type: 'user',
        id: user.id,
      });

      await context.saveSettings();
      context.replySuccess(context.__('ignore.user.added', { name: `**${user.username}**#${user.discriminator} (ID:${user.id})` }));
    }
  }
}

class CommandSubcommand extends Command {
  constructor(client) {
    super(client, {
      name: 'command',
      usage: '<command>',
      category: 'settings',
    });
  }

  async execute(context) {
    const search = context.args.join(' ');
    let command = null;
    if (search) {
      const foundCommand = await this.client.commands.getCommand(search.toLowerCase());
      if (!foundCommand) return context.replyError(context.__('ignore.command.notFound', { search }));
      command = foundCommand;
    } else {
      return context.replyError(context.__('ignore.command.noSearch'));
    }

    if (command.category === 'bot' || command.category === 'owner') {
      return context.replyWarning(context.__('ignore.command.systemCommand', { command: command.name }));
    }

    if (context.settings.ignored.find(i => i.id === command.name)) {
      context.settings.ignored.splice(context.settings.ignored.findIndex(i => i.id === command.name), 1);
      await context.saveSettings();
      context.replySuccess(context.__('ignore.command.removed', { name: `\`${command.name}\`` }));
    } else {
      context.settings.ignored.push({
        type: 'command',
        id: command.name,
      });

      await context.saveSettings();
      context.replySuccess(context.__('ignore.command.added', { name: `\`${command.name}\`` }));
    }
  }
}

module.exports = IgnoreCommand;
