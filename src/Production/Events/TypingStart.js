const Event = require('../../Core/Structures/Event');

class TypingStart extends Event {
  constructor(client) {
    super(client, 'typingStart');
  }

  async handle(channel, user) {
    if (user.id === this.client.user.id) return;

    const phoneCall = this.client.phone.calls.find(call =>
      call.state === 1 &&
      (call.sender === channel.guild.id || call.receiver === channel.guild.id));
    if (phoneCall) {
      const type = phoneCall.sender === channel.guild.id ? 'receiver' : 'sender';
      const targetGuild = this.client.guilds.get(phoneCall[type]);

      const targetChannel = targetGuild.channels.get(
        await this.client.database.getDocument('guild', targetGuild.id).then(s => s.phone.channel),
      );

      targetChannel.startTyping();
    }
  }
}

module.exports = TypingStart;
