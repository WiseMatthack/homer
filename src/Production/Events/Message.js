const Event = require('../../Core/Structures/Event');
const Context = require('../../Core/Structures/Context');
const snekfetch = require('snekfetch');

class Message extends Event {
  constructor(client) {
    super(client, 'message');
  }

  async handle(message) {
    if (message.author.bot || !message.guild) return;

    /* We initiate the context for commands, etc. */
    const ctx = new Context(this.client, message);
    await ctx.getGuildSettings();

    /* We stop here if the channel has to be ignored */
    if (ctx.settings.data.ignoredChannels.includes(ctx.channel.id)) return;

    /* Handle Cleverbot */
    if (ctx.content.startsWith(`<@${this.client.user.id}>`) || ctx.content.startsWith(`<@${this.client.user.id}>`)) {
      const question = ctx.content.split(/ +/g).slice(1).join(' ');

      if (question) {
        ctx.channel.startTyping();

        snekfetch.post('http://cleverbot.io/1.0/ask')
          .send({
            user: this.client.config.api.cleverbotUser,
            key: this.client.config.api.cleverbotKey,
            nick: this.client.user.username,
            text: question,
          })
          .then(async (response) => {
            const parsed = JSON.parse(response.text);
            if (parsed.status !== 'success') return ctx.channel.send(ctx.__('message.cleverbot.error', {
              errorIcon: this.client.constants.statusEmotes.error,
              message: parsed.message,
            }));

            await ctx.channel.send(parsed.response);
            ctx.channel.stopTyping();
          })
          .catch(async (response) => {
            const parsed = JSON.parse(response.text);

            await ctx.channel.send(ctx.__('message.cleverbot.error', {
              errorIcon: this.client.constants.statusEmotes.error,
              message: parsed.message,
            }));
            ctx.channel.stopTyping(true);
          });
      }
    }
  }
}

module.exports = Message;
