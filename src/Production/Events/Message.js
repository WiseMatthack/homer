const Event = require('../../Core/Structures/Event');
const Context = require('../../Core/Structures/Context');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const mtz = require('moment-timezone');
const { appendFile } = require('fs');

class Message extends Event {
  constructor(client) {
    super(client, 'message');
  }

  async handle(message) {
    /* Last active register */
    this.client.lastactive.updateLastactive(message.author.id);

    /* Prevent shit */
    if (message.author.bot || !message.guild) return;

    /* We initiate the context for commands, etc. */
    const ctx = new Context(this.client, message);
    await ctx.getGuildSettings();

    /* AFK remover */
    const afkRemoving = await this.client.absence.getAbsence(ctx.author.id);
    if (afkRemoving) {
      await this.client.absence.removeAbsence(ctx.author.id);
    }

    /* We stop here if the channel has to be ignored */
    if (ctx.settings.data.ignoredChannels.includes(ctx.channel.id)) return;

    /* AFK warner */
    ctx.mentions.users.forEach(async (mention) => {
      const afkObject = await this.client.absence.getAbsence(mention.id);
      if (!afkObject) return;

      let embed = null;
      if (afkObject.reason) {
        embed = new RichEmbed()
          .setDescription(afkObject.reason)
          .setColor(ctx.guild.me.displayHexColor);
      }

      ctx.channel.send(ctx.__('message.afk.warn', {
        name: mention.tag,
        since: mtz(afkObject.time).locale(ctx.settings.data.misc.locale).fromNow(true),
      }), { embed });
    });

    /* Handle Cleverbot */
    if (ctx.content.startsWith(`<@${this.client.user.id}>`) || ctx.content.startsWith(`<@!${this.client.user.id}>`)) {
      const question = ctx.content.split(/ +/g).slice(1).join(' ');

      if (question) {
        if (!this.client.cleverbot) return ctx.channel.send(ctx.__('message.cleverbot.disabled', {
          errorIcon: this.client.constants.statusEmotes.error,
        }));

        ctx.channel.startTyping();
        snekfetch.get(`http://www.cleverbot.com/getreply?key=${this.client.config.api.cleverbot}&input=${question}&cx=${this.client.cleverbotConversations[ctx.author.id] || '0'}`)
          .then(async (response) => {
            const parsed = response.body;

            this.client.cleverbotConversations[ctx.author.id] = parsed.cs;
            await ctx.channel.send(parsed.output);
            ctx.channel.stopTyping();
          })
          .catch(async (response) => {
            const parsed = response.body;

            await ctx.channel.send(ctx.__('message.cleverbot.error', {
              errorIcon: this.client.constants.statusEmotes.error,
              message: parsed.error,
            }));
            ctx.channel.stopTyping(true);
          });
      }
    }

    /* Commands handling */
    const prefix = ctx.isCommand();
    if (prefix) {
      const args = ctx.content.split(/ +/g);
      const command = args.shift().slice(prefix.length).toLowerCase();

      const CmdFile = this.client.commands.getCommand(command);
      if (CmdFile) {
        const cmd = new CmdFile(this.client);

        /* Logging */
        appendFile(`${__dirname}/../../../logs/commands.txt`, `[${Date.now()}] Author: ${ctx.author.id} - Channel: ${ctx.channel.id} - Guild: ${ctx.guild.id} - Content: ${ctx.content}\r\n`, (err) => {
          if (err) console.error(err);
        });

        /* Can the user and bot run the command */
        if (cmd.private) {
          if (!this.client.config.owners.includes(ctx.author.id)) return;
        }

        if (!cmd.private && this.client.disabledCommands[cmd.name]) {
          return ctx.channel.send(ctx.__('message.disabledCommand', {
            errorIcon: this.client.constants.statusEmotes.error,
            cmdName: cmd.name,
            reason: this.client.disabledCommands[cmd.name].reason || ctx.__('global.none'),
          }));
        }

        const missingBotPermissions = cmd.botPermissions
          .filter(perm => !ctx.guild.me.permissions.has(perm));

        if (missingBotPermissions.length > 0) return ctx.channel.send(ctx.__('command.missingPerm.bot', {
          errorIcon: this.client.constants.statusEmotes.error,
          missingPermissions: missingBotPermissions.map(perm => `\`${perm}\``).join(', '),
        }));

        const missingUserPermissions = cmd.userPermissions
          .filter(perm => !ctx.member.permissions.has(perm));

        if (missingUserPermissions.length > 0) return ctx.channel.send(ctx.__('command.missingPerm.user', {
          errorIcon: this.client.constants.statusEmotes.error,
          missingPermissions: missingUserPermissions.map(perm => `\`${perm}\``).join(', '),
        }));

        if (cmd.category !== 0) {
          const channel = this.client.channels.get(this.client.config.logChannels.command);
          if (!channel) return;

          const formattedTime = mtz().format('HH:mm:ss');
          channel.send(`\`[${formattedTime}]\` ⌨ **${guild.name}** (ID:${guild.id}) ran the command \`${cmd.name}\` (\`${message.cleanContent}\`) on **${message.guild.name}**`);
        }

        cmd.run(ctx);
      }
    } else {
      const phone = this.client.phone.calls
        .find(c => c.sender === ctx.guild.id || c.receiver === ctx.guild.id);

      if (phone && phone.state === 1) {
        if (ctx.channel.id !== ctx.settings.data.phone.channel) return;

        const distantSettings = phone.sender === ctx.guild.id ? await this.client.database.getDocument('guild', phone.receiver) : await this.client.database.getDocument('guild', phone.sender);
        const channel = this.client.channels.get(distantSettings.phone.channel);
        if (!channel) return this.client.phone.interruptCall(ctx.guild.id);
        channel.send(`☎ **${ctx.author.tag}**: ${message.cleanContent}`);
      }
    }
  }
}

module.exports = Message;
